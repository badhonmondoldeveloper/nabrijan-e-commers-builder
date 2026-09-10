import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Store, Users, Sparkles, LayoutDashboard, ExternalLink, LogOut, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifySuperAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Super Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
                N
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                NABRIJAN <span className="text-xs text-indigo-400 font-mono font-normal">Super Admin</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold text-slate-300">
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/stores"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <Store className="w-3.5 h-3.5 text-blue-400" />
                <span>Stores Oversight</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>User Directory</span>
              </Link>
              <Link
                href="/admin/subscriptions"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Subscriptions & Billing</span>
              </Link>
              <Link
                href="/admin/integrations"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Integrations Hub</span>
              </Link>
              <Link
                href="/admin/trials"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Trials 360</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs h-8">
                Merchant Dashboard <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400">
                <LogOut className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
