import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { checkoutSchema } from '@/lib/validation/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeSlug, items, ...customerInfo } = body;

    const validated = checkoutSchema.parse(customerInfo);

    const store = await db.store.findUnique({
      where: { slug: storeSlug },
      include: { settings: true },
    });

    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Cart items cannot be empty' }, { status: 400 });
    }

    // Execute atomic transaction for stock validation, order creation, stock deduction & inventory logs
    const result = await db.$transaction(async (tx) => {
      let subtotal = 0;
      let totalCostPrice = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, storeId: store.id },
        });

        if (!product || product.status !== 'ACTIVE') {
          throw new Error(`Product "${item.title || 'Item'}" is no longer available`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.title}". Only ${product.stock} available.`);
        }

        const itemPrice = product.salePrice || product.regularPrice;
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        totalCostPrice += (product.costPrice || 0) * item.quantity;

        processedItems.push({
          productId: product.id,
          productTitle: product.title,
          price: itemPrice,
          costPrice: product.costPrice || 0,
          quantity: item.quantity,
          total: itemTotal,
        });
      }

      // Determine Shipping Fee
      const isInsideDhaka = validated.district.toLowerCase().includes('dhaka');
      const shippingFee = isInsideDhaka ? 60 : 120;
      const discountAmount = 0;
      const totalAmount = subtotal + shippingFee - discountAmount;
      const estimatedProfit = subtotal - totalCostPrice;

      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      // Upsert Customer
      let customer = await tx.customer.findUnique({
        where: {
          storeId_phone: {
            storeId: store.id,
            phone: validated.customerPhone,
          },
        },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            storeId: store.id,
            name: validated.customerName,
            phone: validated.customerPhone,
            email: validated.customerEmail || null,
            totalOrders: 1,
            totalSpent: totalAmount,
          },
        });
      } else {
        await tx.customer.update({
          where: { id: customer.id },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: totalAmount },
          },
        });
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          storeId: store.id,
          orderNumber,
          customerId: customer.id,
          customerName: validated.customerName,
          customerPhone: validated.customerPhone,
          customerEmail: validated.customerEmail || null,
          shippingDivision: validated.division,
          shippingDistrict: validated.district,
          shippingArea: validated.area,
          shippingAddress: validated.address,
          notes: validated.notes || null,
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING',
          subtotal,
          discountAmount,
          shippingFee,
          totalAmount,
          estimatedProfit,
          items: {
            create: processedItems,
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              comment: 'Cash on Delivery order placed by customer',
            },
          },
        },
        include: { items: true },
      });

      // Atomically Deduct Stock & Record Inventory Transactions
      for (const item of processedItems) {
        const updatedProduct = await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        await tx.inventoryTransaction.create({
          data: {
            storeId: store.id,
            productId: item.productId,
            type: 'SALE',
            quantity: item.quantity,
            previousStock: updatedProduct.stock + item.quantity,
            newStock: updatedProduct.stock,
            reference: order.orderNumber,
            notes: `Atomic Order Sale #${order.orderNumber}`,
          },
        });
      }

      return order;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Order creation failed' }, { status: 400 });
  }
}
