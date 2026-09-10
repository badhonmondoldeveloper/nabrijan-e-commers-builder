export interface PathaoConsignmentPayload {
  store_id?: string;
  merchant_order_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city?: number;
  recipient_zone?: number;
  recipient_area?: number;
  delivery_type: 48; // Standard 48h or 12h delivery
  item_type: 2; // Parcel
  special_instruction?: string;
  item_quantity: 1;
  item_weight: number;
  amount_to_collect: number;
}

export class PathaoAdapter {
  /**
   * Normalizes raw Pathao status to NABRIJAN standard shipment status
   */
  static normalizeStatus(rawStatus: string): 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RETURNED' | 'CANCELLED' | 'FAILED' {
    const s = (rawStatus || '').toLowerCase().trim();
    if (s.includes('pending') || s.includes('draft') || s.includes('created')) return 'CREATED';
    if (s.includes('picked') || s.includes('pickup')) return 'PICKED_UP';
    if (s.includes('in_transit') || s.includes('transit') || s.includes('dispatch')) return 'IN_TRANSIT';
    if (s.includes('out_for_delivery') || s.includes('rider')) return 'OUT_FOR_DELIVERY';
    if (s.includes('delivered') || s.includes('complete')) return 'DELIVERED';
    if (s.includes('return') || s.includes('returned')) return 'RETURNED';
    if (s.includes('cancel') || s.includes('cancelled')) return 'CANCELLED';
    return 'FAILED';
  }

  /**
   * Dispatches consignment booking request to Pathao API (or sandbox fallback)
   */
  static async createConsignment(apiKey?: string, apiSecret?: string, payload?: PathaoConsignmentPayload) {
    const isMock = !apiKey || apiKey.startsWith('mock_') || apiKey === 'DEMO_PATHAO_KEY';
    
    if (isMock) {
      const trackingCode = `PTH-${Date.now().toString().slice(-8)}`;
      const consignmentId = `PATHAO-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        success: true,
        consignmentId,
        trackingCode,
        trackingUrl: `https://pathao.com/track/${trackingCode}`,
        rawResponse: { status: 'Success', code: 200, data: { consignment_id: consignmentId, tracking_code: trackingCode } }
      };
    }

    try {
      // Live Pathao API request call
      const res = await fetch('https://api.pathao.com/aladdin/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Pathao API consignment creation failed');
      }
      return {
        success: true,
        consignmentId: data.data.consignment_id,
        trackingCode: data.data.tracking_code,
        trackingUrl: `https://pathao.com/track/${data.data.tracking_code}`,
        rawResponse: data
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Pathao connection error',
        rawResponse: null
      };
    }
  }
}
