export type Locale = 'bn' | 'en';

export const DICTIONARIES: Record<Locale, Record<string, string>> = {
  bn: {
    'nav.home': 'হোম',
    'nav.products': 'সকল প্রোডাক্ট',
    'nav.categories': 'ক্যাটাগরি',
    'nav.cart': 'কার্ট',
    'nav.checkout': 'চেকআউট',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'button.buy_now': 'এখনি অর্ডার করুন',
    'button.add_to_cart': 'কার্টে যোগ করুন',
    'button.view_details': 'বিস্তারিত দেখুন',
    'button.search': 'খুঁজুন',
    'cart.title': 'আপনার শপিং কার্ট',
    'cart.empty': 'আপনার কার্ট খালি রয়েছে',
    'checkout.title': 'অর্ডার সম্পাদন করুন',
    'checkout.name': 'আপনার পুরো নাম',
    'checkout.phone': 'মোবাইল নম্বর',
    'checkout.address': 'সম্পূর্ণ ঠিকানা',
    'checkout.district': 'জেলা নির্বাচন করুন',
    'checkout.subtotal': 'সাবটোটাল',
    'checkout.delivery_fee': 'ডেলিভারি চার্জ',
    'checkout.total': 'সর্বমোট মূল্য',
    'checkout.place_order': 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)',
    'order.success_title': 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
    'order.tracking': 'কুরিয়ার ট্র্যাকিং কোড',
    'badge.cod': 'ক্যাশ অন ডেলিভারি',
    'badge.free_shipping': 'ফ্রি ডেলিভারি'
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'All Products',
    'nav.categories': 'Categories',
    'nav.cart': 'Cart',
    'nav.checkout': 'Checkout',
    'nav.dashboard': 'Dashboard',
    'button.buy_now': 'Buy Now',
    'button.add_to_cart': 'Add to Cart',
    'button.view_details': 'View Details',
    'button.search': 'Search',
    'cart.title': 'Your Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'checkout.title': 'Complete Your Order',
    'checkout.name': 'Full Name',
    'checkout.phone': 'Phone Number',
    'checkout.address': 'Full Address',
    'checkout.district': 'Select District',
    'checkout.subtotal': 'Subtotal',
    'checkout.delivery_fee': 'Delivery Fee',
    'checkout.total': 'Total Price',
    'checkout.place_order': 'Confirm Order (Cash on Delivery)',
    'order.success_title': 'Your order has been received successfully!',
    'order.tracking': 'Courier Tracking Code',
    'badge.cod': 'Cash on Delivery',
    'badge.free_shipping': 'Free Shipping'
  }
};

export class I18nService {
  static translate(key: string, locale: Locale = 'bn'): string {
    return DICTIONARIES[locale]?.[key] || DICTIONARIES['en']?.[key] || key;
  }
}
