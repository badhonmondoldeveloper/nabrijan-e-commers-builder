'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Locale } from '@/lib/integrations/i18n/dictionaries';

export function LanguageSwitcher({ onLanguageChange }: { onLanguageChange?: (locale: Locale) => void }) {
  const [selectedLocale, setSelectedLocale] = useState<Locale>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('nabrijan_lang') as Locale;
    if (saved && (saved === 'bn' || saved === 'en')) {
      setSelectedLocale(saved);
    }
  }, []);

  const handleChange = (locale: Locale) => {
    setSelectedLocale(locale);
    localStorage.setItem('nabrijan_lang', locale);
    if (onLanguageChange) {
      onLanguageChange(locale);
    }
    window.dispatchEvent(new CustomEvent('languageChange', { detail: locale }));
  };

  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
      <button
        type="button"
        onClick={() => handleChange(selectedLocale === 'bn' ? 'en' : 'bn')}
        className="px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition uppercase"
      >
        {selectedLocale === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}
      </button>
    </div>
  );
}
