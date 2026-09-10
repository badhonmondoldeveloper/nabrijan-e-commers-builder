'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_CURRENCIES } from '@/lib/integrations/currency/currency-service';
import { DollarSign } from 'lucide-react';

export function CurrencySwitcher({ onCurrencyChange }: { onCurrencyChange?: (code: string) => void }) {
  const [selectedCurrency, setSelectedCurrency] = useState('BDT');

  useEffect(() => {
    const saved = localStorage.getItem('nabrijan_currency');
    if (saved && SUPPORTED_CURRENCIES[saved]) {
      setSelectedCurrency(saved);
    }
  }, []);

  const handleChange = (code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem('nabrijan_currency', code);
    if (onCurrencyChange) {
      onCurrencyChange(code);
    }
    // Dispatch custom event so other components update automatically
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: code }));
  };

  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <DollarSign className="w-3.5 h-3.5 text-slate-500 ml-1" />
      <select
        value={selectedCurrency}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
      >
        {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
          <option key={curr.code} value={curr.code} className="text-slate-900 bg-white">
            {curr.symbol} {curr.code}
          </option>
        ))}
      </select>
    </div>
  );
}
