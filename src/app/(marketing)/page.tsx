import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Zap, ShieldCheck, Palette, BarChart3, Globe, ArrowRight, CheckCircle2, Store } from 'lucide-react';

export default function SaaSMarketingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              N
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Nabrijan E-Commerce
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-white transition">Features</Link>
            <Link href="#templates" className="hover:text-white transition">Templates</Link>
            <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-md shadow-blue-600/20">
                Create Store <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-blue-500/30 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            ⚡ Multi-Tenant SaaS E-Commerce Platform
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Build Your Own Single-Vendor E-Commerce Empire
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
            Launch professional online stores with high-performance theme engines, local Cash on Delivery (COD), ZiniPay platform billing, real-time inventory, profit analytics, and granular staff controls.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xl shadow-blue-600/30">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-12 px-8 border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white">
                View Subscription Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Everything Needed to Run a High-Converting Store
            </h2>
            <p className="text-slate-400">
              Designed from mobile-first architecture for maximum speed, accessibility, security, and scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Palette className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Dynamic Theme Engine</CardTitle>
                <CardDescription className="text-slate-400">
                  Visual theme editor with live mobile/tablet/desktop viewports and customizable JSON sections.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Strict Multi-Tenant Isolation</CardTitle>
                <CardDescription className="text-slate-400">
                  Every merchant store's database state is completely isolated with server-side RBAC validation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Bangladesh Local COD & Payments</CardTitle>
                <CardDescription className="text-slate-400">
                  Optimized mobile Cash on Delivery checkout for customers, plus ZiniPay integration for SaaS billing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Summary */}
      <section id="pricing" className="py-20 bg-slate-900/30 border-t border-slate-800/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Transparent Platform Subscriptions</h2>
            <p className="text-slate-400">Select the right plan for your business scale and launch your store in minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl">Starter Plan</CardTitle>
                <CardDescription className="text-slate-400">Perfect for new merchants</CardDescription>
                <div className="mt-4 text-3xl font-extrabold">৳990 <span className="text-sm text-slate-400 font-normal">/ month</span></div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 1 Active Store</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Up to 100 Products</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 2 Staff Accounts</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> COD Checkout Engine</div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/register?plan=starter">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Select Starter</Button>
                </Link>
              </div>
            </Card>

            {/* Business Plan */}
            <Card className="bg-slate-900 border-blue-500 text-white flex flex-col justify-between relative shadow-xl shadow-blue-600/10">
              <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Business Plan</CardTitle>
                <CardDescription className="text-slate-400">For growing retail brands</CardDescription>
                <div className="mt-4 text-3xl font-extrabold">৳2,490 <span className="text-sm text-slate-400 font-normal">/ month</span></div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 3 Active Stores</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Unlimited Products</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 10 Staff Accounts</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Visual Theme Builder</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Custom Domain Mapping</div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/register?plan=business">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">Select Business</Button>
                </Link>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl">Pro Enterprise</CardTitle>
                <CardDescription className="text-slate-400">High-volume sellers & agencies</CardDescription>
                <div className="mt-4 text-3xl font-extrabold">৳4,990 <span className="text-sm text-slate-400 font-normal">/ month</span></div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 10 Active Stores</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Unlimited Products & Staff</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Profit Analytics & Reports</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Premium Theme Access</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Dedicated Priority Support</div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/register?plan=pro">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Select Pro</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>© 2026 Nabrijan E-Commerce SaaS Platform. Built for scalability, performance, and Bangladesh merchants.</p>
        </div>
      </footer>
    </div>
  );
}
