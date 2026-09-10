'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  RotateCcw, 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  Truck, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function StorefrontCustomerAccountPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'loyalty' | 'returns'>('orders');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loyalty, setLoyalty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      setMsg('Please enter a valid 11-digit Bangladesh phone number');
      return;
    }
    setIsLoggedIn(true);
    fetchCustomerData(phone);
  };

  const fetchCustomerData = async (customerPhone: string) => {
    setLoading(true);
    try {
      // Mock customer orders & loyalty lookup
      setOrders([
        {
          id: 'ord_1',
          orderNumber: 'ORD-9842',
          createdAt: new Date().toISOString(),
          totalAmount: 1450,
          orderStatus: 'DELIVERED',
          items: [{ productTitle: 'Premium Cotton Panjabi', quantity: 1, price: 1450 }]
        }
      ]);
      setLoyalty({
        pointsBalance: 250,
        tier: 'SILVER',
        totalEarned: 500
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <User className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Customer Account Login</h1>
            <p className="text-xs text-slate-500">Track orders, manage wishlists, 1-click reorder, and claim loyalty rewards.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Phone Number (e.g. 01700000000)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {msg && <div className="text-xs text-rose-600 font-semibold">{msg}</div>}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              Access Account Portal
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href={`/store/${slug}`} className="text-xs text-slate-500 hover:text-indigo-600 font-semibold">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 max-w-6xl mx-auto font-sans space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
            {phone.slice(-2)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Customer Account ({phone})</h1>
            <p className="text-xs text-slate-500">Logged in via OTP verification</p>
          </div>
        </div>

        {loyalty && (
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">VIP Tier</div>
              <div className="text-sm font-extrabold text-slate-900">{loyalty.tier} ({loyalty.pointsBalance} Points)</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'orders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> My Orders
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'wishlist' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" /> Wishlist
        </button>
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`pb-3 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'loyalty' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" /> Loyalty Rewards
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Recent Order History</h2>
            {orders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No order history found for this phone number.</div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">#{ord.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {ord.items.map((i: any) => i.productTitle).join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-900">৳{ord.totalAmount}</div>
                        <div className="text-[10px] text-slate-400">Cash on Delivery</div>
                      </div>
                      <button className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Loyalty Points & VIP Rewards</h2>
            <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider">Current Balance</div>
              <div className="text-3xl font-black">{loyalty?.pointsBalance || 0} Points</div>
              <div className="text-xs opacity-90">Every 100 BDT spent = 5 Loyalty Points. Redeem points for discount coupons at checkout.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
