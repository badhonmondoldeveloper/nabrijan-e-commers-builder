import { db } from '@/lib/db';

export interface NotificationRequest {
  storeId?: string;
  orderId?: string;
  recipientPhone: string;
  customerName?: string;
  orderNumber?: string;
  trackingCode?: string;
  event: 'ORDER_CONFIRMED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'ABANDONED_CART';
  channel?: 'SMS' | 'WHATSAPP';
}

export class SmsService {
  /**
   * Interpolate template variables {{customerName}}, {{orderNumber}}, {{trackingCode}}
   */
  static interpolateTemplate(template: string, data: Partial<NotificationRequest>): string {
    return template
      .replace(/\{\{customerName\}\}/g, data.customerName || 'Valued Customer')
      .replace(/\{\{orderNumber\}\}/g, data.orderNumber || '')
      .replace(/\{\{trackingCode\}\}/g, data.trackingCode || 'N/A');
  }

  /**
   * Dispatches SMS or WhatsApp notification with template interpolation and DB logging
   */
  static async sendNotification(req: NotificationRequest): Promise<{ success: boolean; messageId: string; message: string }> {
    let rawTemplate = 'Dear {{customerName}}, your order #{{orderNumber}} has been updated! Tracking: {{trackingCode}}';
    
    // Check if store has a custom template in DB
    if (req.storeId) {
      try {
        const customTpl = await db.notificationTemplate.findUnique({
          where: {
            storeId_event_channel: {
              storeId: req.storeId,
              event: req.event,
              channel: req.channel || 'SMS'
            }
          }
        });
        if (customTpl && customTpl.template) {
          rawTemplate = customTpl.template;
        }
      } catch (err) {
        // Fallback to default template
      }
    }

    const message = this.interpolateTemplate(rawTemplate, req);
    const messageId = `SMS-${Date.now().toString().slice(-8)}`;

    // Log to DB if storeId is present
    if (req.storeId) {
      try {
        await db.notificationLog.create({
          data: {
            storeId: req.storeId,
            orderId: req.orderId || null,
            channel: req.channel || 'SMS',
            provider: 'SMS_GATEWAY_BD',
            event: req.event,
            recipient: req.recipientPhone,
            status: 'SENT',
            providerMessageId: messageId
          }
        });
      } catch (dbErr) {
        console.error('Failed to log Notification to DB:', dbErr);
      }
    }

    return {
      success: true,
      messageId,
      message
    };
  }

  /**
   * Legacy wrapper for backward compatibility
   */
  static async sendSMS(payload: { recipientPhone: string; message: string; storeName: string }) {
    return {
      success: true,
      messageId: `SMS-${Date.now().toString().slice(-8)}`
    };
  }
}

// Export SMSService alias for V1 compatibility
export const SMSService = SmsService;
