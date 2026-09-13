import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Warehouse,
  Tag,
  Palette,
  TrendingUp,
  Settings,
  Globe,
  LogOut,
  ExternalLink,
  ChevronDown,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApkDownloadModal from '@/components/apk/ApkDownloadModal';

export default async function StoreDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch store and verify access
  const store = await db.store.findUnique({
    where: { id: params.storeId },
    include: {
      settings: true,
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  if (!store) {
    notFound();
  }

  // Verify ownership or staff access
  if (store.ownerId !== user.id && user.role !== 'SUPER_ADMIN') {
    const isStaff = await db.staff.findFirst({
      where: { storeId: store.id, userId: user.id, status: 'ACTIVE' },
    });
    if (!isStaff) {
      redirect('/dashboard');
    }
  }

  // Fetch all user stores for store switcher dropdown
  const allUserStores = await db.store.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#063B2A] border-r border-[#0b4d37] flex flex-col shrink-0 text-emerald-100">
        {/* Store Brand / Switcher */}
        <div className="p-4 border-b border-[#0b4d37] bg-[#04281c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#55B510] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md shadow-[#55B510]/30">
                {store.name.charAt(0)}
              </div>
              <div className="truncate">
                <h2 className="text-sm font-bold text-white truncate">{store.name}</h2>
                <span className="text-xs text-emerald-300/70 font-mono">/store/{store.slug}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href={`/store/${store.slug}`} target="_blank" className="w-full">
              <Button variant="outline" size="sm" className="w-full border-[#55B510]/40 bg-[#063B2A] text-white hover:bg-[#55B510] hover:border-[#55B510] text-xs h-8 font-bold transition">
                View Storefront <ExternalLink className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 text-xs font-semibold text-emerald-100/80 flex-1 overflow-y-auto">
          <Link
            href={`/dashboard/stores/${store.id}`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <LayoutDashboard className="w-4 h-4 text-[#55B510]" />
            <span>Dashboard</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/products`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Package className="w-4 h-4 text-[#55B510]" />
            <span>Products</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/categories`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Layers className="w-4 h-4 text-[#55B510]" />
            <span>Categories</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/orders`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <ShoppingCart className="w-4 h-4 text-[#55B510]" />
            <span>Orders</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/inventory`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Warehouse className="w-4 h-4 text-[#55B510]" />
            <span>Inventory</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/customers`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Users className="w-4 h-4 text-[#55B510]" />
            <span>Customers</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/coupons`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Tag className="w-4 h-4 text-[#55B510]" />
            <span>Discounts & Coupons</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/builder`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Palette className="w-4 h-4 text-[#55B510]" />
            <span>Visual Theme Editor</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/analytics`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <TrendingUp className="w-4 h-4 text-[#55B510]" />
            <span>Profit & Sales Analytics</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/reviews`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <MessageSquare className="w-4 h-4 text-[#55B510]" />
            <span>Product Reviews</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/staff`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <ShieldCheck className="w-4 h-4 text-[#55B510]" />
            <span>Staff & Permissions</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/domains`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Globe className="w-4 h-4 text-[#55B510]" />
            <span>Custom Domains</span>
          </Link>

          <Link
            href={`/dashboard/stores/${store.id}/media`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <ImageIcon className="w-4 h-4 text-[#55B510]" />
            <span>Media Library</span>
          </Link>

          <Link
            href={`/dashboard/billing`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition"
          >
            <Sparkles className="w-4 h-4 text-[#55B510]" />
            <span>Platform Billing & Plans</span>
          </Link>

          <Link
            href={`/dashboard/affiliate`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#55B510] hover:text-white transition text-[#55B510] font-extrabold"
          >
            <Sparkles className="w-4 h-4 text-[#55B510]" />
            <span>Affiliate Program (15%)</span>
          </Link>
        </nav>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-[#0b4d37] bg-[#04281c] flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="font-bold text-white truncate">{user.name}</p>
            <p className="text-emerald-300/70 truncate text-[11px]">{user.email}</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-200 hover:text-rose-400 hover:bg-[#063B2A]">
              <LogOut className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F6FAF4] p-4 md:p-8">
        {children}
      </main>

      {/* Merchant APK App Popup & Download Button */}
      <ApkDownloadModal autoShow={true} />
    </div>
  );
}
