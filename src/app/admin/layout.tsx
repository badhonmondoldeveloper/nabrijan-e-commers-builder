import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Store, Users, Sparkles, LayoutDashboard, ExternalLink, LogOut, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifySuperAdmin();

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] flex flex-col font-sans">
      {/* Super Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#063B2A] border-b border-[#0b4d37] shadow-xl text-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Nabrijan" className="h-9 w-auto bg-white/95 p-1 rounded-xl shadow-md" />
              <span className="font-extrabold text-white text-base tracking-tight">
                NABRIJAN <span className="text-xs text-[#55B510] font-mono font-bold">Super Admin</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold text-emerald-100">
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/stores"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition"
              >
                <Store className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Stores Oversight</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition"
              >
                <Users className="w-3.5 h-3.5 text-[#55B510]" />
                <span>User Directory</span>
              </Link>
              <Link
                href="/admin/subscriptions"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Subscriptions & Billing</span>
              </Link>
              <Link
                href="/admin/integrations"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Integrations Hub</span>
              </Link>
              <Link
                href="/admin/trials"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition"
              >
                <Clock className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Trials 360</span>
              </Link>
              <Link
                href="/admin/affiliates"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition text-[#55B510] font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Affiliates (15%)</span>
              </Link>
              <Link
                href="/admin/chat"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition text-emerald-200 font-bold"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Live Support Chat</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-[#55B510] hover:text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#55B510]" />
                <span>Site Customization</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-[#55B510] bg-[#55B510] text-white hover:bg-[#489d0d] text-xs h-8 font-bold shadow-md">
                Merchant Dashboard <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-200 hover:text-rose-400 hover:bg-[#04281c]">
                <LogOut className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#F6FAF4] text-[#17221D]">
        {children}
      </main>
    </div>
  );
}
