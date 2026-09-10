import { db } from '@/lib/db';
import { PathaoAdapter } from './courier/pathao-adapter';
import { SteadfastAdapter } from './courier/steadfast-adapter';

export interface CourierConsignmentRequest {
  storeId?: string;
  orderId?: string;
  storeName: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientDistrict: string;
  codAmount: number;
  note?: string;
}

export interface CourierConsignmentResponse {
  success: boolean;
  courierName: 'PATHAO' | 'STEADFAST';
  trackingCode: string;
  consignmentId: string;
  trackingUrl?: string;
  message: string;
}

export class CourierService {
  /**
   * Dispatch COD order consignment to Steadfast or Pathao Courier API
   * and persist Shipment + ShipmentEvent + IntegrationAttempt in DB
   */
  static async createConsignment(
    provider: 'STEADFAST' | 'PATHAO',
    payload: CourierConsignmentRequest
  ): Promise<CourierConsignmentResponse> {
    // 1. Fetch Store Courier Integration credentials if available
    let apiKey: string | undefined;
    let apiSecret: string | undefined;

    if (payload.storeId) {
      try {
        const integration = await db.courierIntegration.findUnique({
          where: { storeId: payload.storeId }
        });
        if (integration && integration.provider === provider) {
          apiKey = integration.apiKey || undefined;
          apiSecret = integration.apiSecret || undefined;
        }
      } catch (err) {
        console.error('Failed to load store courier integration details:', err);
      }
    }

    let result;
    if (provider === 'PATHAO') {
      result = await PathaoAdapter.createConsignment(apiKey, apiSecret, {
        merchant_order_id: payload.orderNumber,
        recipient_name: payload.recipientName,
        recipient_phone: payload.recipientPhone,
        recipient_address: `${payload.recipientAddress}, ${payload.recipientDistrict}`,
        delivery_type: 48,
        item_type: 2,
        item_quantity: 1,
        item_weight: 0.5,
        amount_to_collect: payload.codAmount,
        special_instruction: payload.note
      });
    } else {
      result = await SteadfastAdapter.createConsignment(apiKey, apiSecret, {
        invoice: payload.orderNumber,
        recipient_name: payload.recipientName,
        recipient_phone: payload.recipientPhone,
        recipient_address: `${payload.recipientAddress}, ${payload.recipientDistrict}`,
        cod_amount: payload.codAmount,
        note: payload.note
      });
    }

    // 2. Log Integration Attempt
    if (payload.storeId) {
      try {
        await db.integrationAttempt.create({
          data: {
            storeId: payload.storeId,
            provider,
            action: 'CREATE_CONSIGNMENT',
            resource: `Order #${payload.orderNumber}`,
            status: result.success ? 'SUCCESS' : 'FAILED',
            safeErrorMessage: result.success ? null : (result as any).error
          }
        });
      } catch (e) {
        console.error('Failed to save integration attempt log:', e);
      }
    }

    if (!result.success || !result.trackingCode) {
      throw new Error((result as any).error || `${provider} consignment dispatch failed`);
    }

    // 3. Save / Upsert Shipment in DB if orderId is provided
    if (payload.storeId && payload.orderId) {
      try {
        const shipment = await db.shipment.upsert({
          where: { orderId: payload.orderId },
          create: {
            storeId: payload.storeId,
            orderId: payload.orderId,
            provider,
            consignmentId: result.consignmentId,
            trackingCode: result.trackingCode,
            trackingUrl: result.trackingUrl,
            deliveryStatus: 'CREATED',
            codAmount: payload.codAmount,
            pickupAddress: payload.storeName,
            deliveryAddress: `${payload.recipientAddress}, ${payload.recipientDistrict}`
          },
          update: {
            provider,
            consignmentId: result.consignmentId,
            trackingCode: result.trackingCode,
            trackingUrl: result.trackingUrl,
            deliveryStatus: 'CREATED',
            updatedAt: new Date()
          }
        });

        await db.shipmentEvent.create({
          data: {
            shipmentId: shipment.id,
            status: 'CREATED',
            notes: `Consignment created with ${provider} (Tracking: ${result.trackingCode})`
          }
        });
      } catch (dbErr) {
        console.error('Failed to persist shipment record:', dbErr);
      }
    }

    return {
      success: true,
      courierName: provider,
      trackingCode: result.trackingCode,
      consignmentId: result.consignmentId || '',
      trackingUrl: result.trackingUrl,
      message: `Order #${payload.orderNumber} successfully booked with ${provider} Courier (Tracking: ${result.trackingCode})`
    };
  }
}
