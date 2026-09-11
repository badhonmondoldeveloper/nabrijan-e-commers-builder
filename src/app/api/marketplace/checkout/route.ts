import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productId,
      items: rawItems,
      quantity = 1,
      customerName,
      customerPhone,
      customerEmail,
      shippingDivision = 'Dhaka',
      shippingDistrict = 'Dhaka',
      shippingArea,
      shippingAddress,
      paymentMethod = 'COD',
      idempotencyKey,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress) {
      return NextResponse.json({ message: 'Missing required buyer information' }, { status: 400 });
    }

    // Handle Idempotency Key check
    if (idempotencyKey) {
      const existingMarketplaceOrder = await db.marketplaceOrder.findUnique({
        where: { idempotencyKey },
      });
      if (existingMarketplaceOrder) {
        return NextResponse.json({
          success: true,
          message: 'Order retrieved via idempotency key',
          orderNumber: existingMarketplaceOrder.orderNumber,
          orderId: existingMarketplaceOrder.id,
        });
      }
    }

    // Build item list
    let checkoutItems: Array<{ productId: string; quantity: number }> = [];
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      checkoutItems = rawItems;
    } else if (productId) {
      checkoutItems = [{ productId, quantity }];
    } else {
      return NextResponse.json({ message: 'No items provided for checkout' }, { status: 400 });
    }

    // Fetch products and validate stock & marketplace status
    const productIds = checkoutItems.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: {
        id: { in: productIds },
        status: 'ACTIVE',
      },
      include: {
        store: true,
        marketplaceListing: true,
      },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ message: 'One or more items in cart are no longer available' }, { status: 400 });
    }

    // Group items by storeId for SellerOrders
    const storeMap = new Map<string, Array<{ product: typeof dbProducts[0]; quantity: number }>>();
    for (const item of checkoutItems) {
      const prod = dbProducts.find((p) => p.id === item.productId)!;
      if (prod.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for product "${prod.title}"` }, { status: 400 });
      }
      if (!storeMap.has(prod.storeId)) {
        storeMap.set(prod.storeId, []);
      }
      storeMap.get(prod.storeId)!.push({ product: prod, quantity: item.quantity });
    }

    // Platform Settings for default commission
    let platformSettings = await db.platformSettings.findUnique({
      where: { id: 'global-settings' },
    });
    if (!platformSettings) {
      platformSettings = await db.platformSettings.create({
        data: {
          id: 'global-settings',
          defaultCommissionRate: new Prisma.Decimal('0.0200'),
          minWithdrawalLimit: new Prisma.Decimal('500.00'),
        },
      });
    }

    const defaultRate = platformSettings.defaultCommissionRate ?? new Prisma.Decimal('0.0200');

    // Fetch Category Commission overrides
    const categoryCommissions = await db.categoryCommission.findMany();
    const categoryRateMap = new Map<string, Prisma.Decimal>();
    for (const cc of categoryCommissions) {
      categoryRateMap.set(cc.categoryName.toLowerCase(), cc.commissionRate);
    }

    // Generate parent order number
    const totalOrdersCount = await db.marketplaceOrder.count();
    const parentOrderNumber = `MP-${Date.now().toString().slice(-6)}-${totalOrdersCount + 1}`;

    // Calculate grand total using Decimal
    let grandTotal = new Prisma.Decimal('0.00');

    // Execute atomic transaction for multi-seller checkout
    const result = await db.$transaction(async (tx) => {
      // 1. Create Parent MarketplaceOrder
      const parentOrder = await tx.marketplaceOrder.create({
        data: {
          orderNumber: parentOrderNumber,
          buyerName: customerName,
          buyerPhone: customerPhone,
          buyerEmail: customerEmail || null,
          shippingDivision,
          shippingDistrict,
          shippingArea: shippingArea || null,
          shippingAddress,
          totalAmount: new Prisma.Decimal('0.00'), // updated below
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          idempotencyKey: idempotencyKey || null,
        },
      });

      // 2. Iterate per Seller/Store
      let storeIndex = 1;
      for (const [storeId, storeItems] of storeMap.entries()) {
        let sellerSubtotal = new Prisma.Decimal('0.00');
        let sellerCommissionTotal = new Prisma.Decimal('0.00');
        const sellerShippingFee = new Prisma.Decimal('60.00'); // Standard shipping per seller

        const childOrderNumber = `${parentOrderNumber}-S${storeIndex++}`;

        // Create Child SellerOrder record
        const sellerOrder = await tx.sellerOrder.create({
          data: {
            marketplaceOrderId: parentOrder.id,
            storeId,
            orderNumber: childOrderNumber,
            subtotal: new Prisma.Decimal('0.00'),
            shippingFee: sellerShippingFee,
            commissionAmount: new Prisma.Decimal('0.00'),
            totalAmount: new Prisma.Decimal('0.00'),
            netSellerAmount: new Prisma.Decimal('0.00'),
            orderStatus: 'PENDING',
            paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
            fulfillmentStatus: 'UNFULFILLED',
            settlementStatus: 'UNSETTLED',
          },
        });

        for (const { product, quantity } of storeItems) {
          const unitPrice = product.salePrice ?? product.regularPrice;
          const itemTotal = unitPrice.mul(quantity);
          sellerSubtotal = sellerSubtotal.add(itemTotal);

          // Create OrderItem attached to sellerOrder
          const orderItem = await tx.orderItem.create({
            data: {
              sellerOrderId: sellerOrder.id,
              productId: product.id,
              productTitle: product.title,
              sku: product.sku,
              price: unitPrice,
              costPrice: product.costPrice,
              quantity,
              total: itemTotal,
            },
          });

          // Determine commission rate for this item (Category override or default)
          const catKey = (product.marketplaceCategory || '').toLowerCase();
          const commissionRate = categoryRateMap.get(catKey) ?? defaultRate;
          const itemCommission = itemTotal.mul(commissionRate);
          const itemNetSeller = itemTotal.sub(itemCommission);

          sellerCommissionTotal = sellerCommissionTotal.add(itemCommission);

          // Snapshot Commission Record (MarketplaceCommission)
          await tx.marketplaceCommission.create({
            data: {
              marketplaceOrderId: parentOrder.id,
              sellerOrderId: sellerOrder.id,
              orderItemId: orderItem.id,
              storeId,
              commissionRate,
              grossAmount: itemTotal,
              commissionAmount: itemCommission,
              sellerNetAmount: itemNetSeller,
            },
          });

          // Decrement inventory stock safely
          await tx.product.update({
            where: { id: product.id },
            data: { stock: product.stock - quantity },
          });
        }

        const sellerTotalAmount = sellerSubtotal.add(sellerShippingFee);
        const sellerNetTotal = sellerTotalAmount.sub(sellerCommissionTotal);

        // Update child SellerOrder with final decimal amounts
        await tx.sellerOrder.update({
          where: { id: sellerOrder.id },
          data: {
            subtotal: sellerSubtotal,
            commissionAmount: sellerCommissionTotal,
            totalAmount: sellerTotalAmount,
            netSellerAmount: sellerNetTotal,
          },
        });

        // Upsert SellerWallet
        let wallet = await tx.sellerWallet.findUnique({
          where: { storeId },
        });
        if (!wallet) {
          wallet = await tx.sellerWallet.create({
            data: {
              storeId,
              balance: new Prisma.Decimal('0.00'),
              pendingBalance: new Prisma.Decimal('0.00'),
              pendingPayouts: new Prisma.Decimal('0.00'),
              totalEarned: new Prisma.Decimal('0.00'),
              totalCommissionPaid: new Prisma.Decimal('0.00'),
              totalWithdrawn: new Prisma.Decimal('0.00'),
            },
          });
        }

        // Create Immutable Ledger Transaction (SALE_PENDING)
        await tx.ledgerTransaction.create({
          data: {
            walletId: wallet.id,
            storeId,
            orderId: sellerOrder.id,
            type: 'SALE_PENDING',
            amount: sellerTotalAmount,
            commissionAmount: sellerCommissionTotal,
            netAmount: sellerNetTotal,
            currency: 'BDT',
            referenceId: sellerOrder.id,
            description: `Pending sale credit for Seller Order #${childOrderNumber} (Awaiting Clearance)`,
          },
        });

        // Credit PENDING BALANCE (not available balance yet!)
        await tx.sellerWallet.update({
          where: { id: wallet.id },
          data: {
            pendingBalance: wallet.pendingBalance.add(sellerNetTotal),
            totalEarned: wallet.totalEarned.add(sellerNetTotal),
            totalCommissionPaid: wallet.totalCommissionPaid.add(sellerCommissionTotal),
          },
        });

        grandTotal = grandTotal.add(sellerTotalAmount);
      }

      // Update parent MarketplaceOrder totalAmount
      await tx.marketplaceOrder.update({
        where: { id: parentOrder.id },
        data: { totalAmount: grandTotal },
      });

      return parentOrder;
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully on Nabrijan Marketplace!',
      orderNumber: result.orderNumber,
      orderId: result.id,
    });
  } catch (error: any) {
    console.error('Marketplace checkout error:', error);
    return NextResponse.json({ message: error.message || 'Marketplace checkout failed' }, { status: 500 });
  }
}
