import { db } from '@/lib/db';
import { SmsService } from '@/lib/integrations/sms-service';

export class AutomationEngine {
  /**
   * Triggers active workflows matching event type
   */
  static async triggerEvent(
    storeId: string,
    event: 'ORDER_CREATED' | 'ORDER_DELIVERED' | 'CART_ABANDONED' | 'LOW_STOCK',
    payload: any
  ) {
    const workflows = await db.automationWorkflow.findMany({
      where: { storeId, trigger: event, isActive: true }
    });

    for (const wf of workflows) {
      try {
        if (wf.action === 'SEND_SMS' && payload.customerPhone) {
          await SmsService.sendNotification({
            storeId,
            recipientPhone: payload.customerPhone,
            customerName: payload.customerName,
            orderNumber: payload.orderNumber,
            event: 'ORDER_CONFIRMED'
          });
        }

        await db.automationExecution.create({
          data: {
            workflowId: wf.id,
            status: 'SUCCESS',
            logDetails: `Workflow "${wf.name}" executed successfully for event ${event}`
          }
        });
      } catch (err: any) {
        await db.automationExecution.create({
          data: {
            workflowId: wf.id,
            status: 'FAILED',
            logDetails: err.message || 'Workflow execution error'
          }
        });
      }
    }
  }
}
