export interface SteadfastConsignmentPayload {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
}

export class SteadfastAdapter {
  /**
   * Normalizes raw Steadfast status to NABRIJAN standard shipment status
   */
  static normalizeStatus(rawStatus: string): 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RETURNED' | 'CANCELLED' | 'FAILED' {
    const s = (rawStatus || '').toLowerCase().trim();
    if (s.includes('pending') || s.includes('created')) return 'CREATED';
    if (s.includes('picked') || s.includes('received')) return 'PICKED_UP';
    if (s.includes('in_transit') || s.includes('transit') || s.includes('transfer')) return 'IN_TRANSIT';
    if (s.includes('out_for_delivery') || s.includes('delivery')) return 'OUT_FOR_DELIVERY';
    if (s.includes('delivered') || s.includes('completed')) return 'DELIVERED';
    if (s.includes('returned') || s.includes('return_partial')) return 'RETURNED';
    if (s.includes('cancelled') || s.includes('cancel')) return 'CANCELLED';
    return 'FAILED';
  }

  /**
   * Dispatches consignment booking request to Steadfast API (or sandbox fallback)
   */
  static async createConsignment(apiKey?: string, apiSecret?: string, payload?: SteadfastConsignmentPayload) {
    const isMock = !apiKey || apiKey.startsWith('mock_') || apiKey === 'DEMO_STEADFAST_KEY';
    
    if (isMock) {
      const trackingCode = `STD-${Date.now().toString().slice(-8)}`;
      const consignmentId = `STEADFAST-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        success: true,
        consignmentId,
        trackingCode,
        trackingUrl: `https://steadfast.com.bd/t/${trackingCode}`,
        rawResponse: { status: 200, consignment: { consignment_id: consignmentId, tracking_code: trackingCode } }
      };
    }

    try {
      const res = await fetch('https://portal.packzy.com/api/v1/create_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey || '',
          'Secret-Key': apiSecret || ''
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.status !== 200) {
        throw new Error(data.message || 'Steadfast API consignment creation failed');
      }
      return {
        success: true,
        consignmentId: String(data.consignment.consignment_id),
        trackingCode: data.consignment.tracking_code,
        trackingUrl: `https://steadfast.com.bd/t/${data.consignment.tracking_code}`,
        rawResponse: data
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Steadfast connection error',
        rawResponse: null
      };
    }
  }
}
