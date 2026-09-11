import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Store, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MerchantStoresDirectoryPage() {
  let stores: any[] = [];

  try {
    stores = await db.store.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        logo: true,
        settings: {
          select: { phone: true, address: true },
        },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (err) {
    console.warn('MerchantStoresDirectoryPage db fetch skipped during build without DB:', err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <MarketplaceHeader />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Store className="w-3.5 h-3.5" /> Merchant Directory
              </div>
              <h1 className="text-3xl font-black text-white">Verified Merchant Storefronts</h1>
              <p className="text-xs text-slate-400 mt-1">
                Discover {stores.length} independent Bangladeshi online stores powered by Nabrijan
              </p>
            </div>

            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 self-start md:self-auto"
            >
              <Store className="w-4 h-4" /> Start Your Own Store Free →
            </Link>
          </div>

          {/* Stores Grid */}
          {stores.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Store className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="text-lg font-bold text-white">No merchant stores listed yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Be the first Bangladeshi entrepreneur to launch your independent online store on Nabrijan!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {stores.map((st) => (
                <div
                  key={st.id}
                  className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-5 shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xl font-bold text-emerald-400 flex-shrink-0">
                      {st.logo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={st.logo} alt={st.name} className="w-full h-full object-cover" />
                      ) : (
                        st.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-base text-white truncate group-hover:text-emerald-400 transition-colors">
                          {st.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">{st.category || 'General Store'}</span>
                      {st.settings?.address && (
                        <span className="text-[11px] text-slate-500 block truncate mt-1">📍 {st.settings.address}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="text-xs text-emerald-400 font-bold">
                      {st._count?.products ?? 0} Products Listed
                    </div>
                    <Link
                      href={`/store/${st.slug}`}
                      target="_blank"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
                    >
                      Visit Store <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
