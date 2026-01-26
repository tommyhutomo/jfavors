'use client';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          language === 'en'
            ? 'bg-brand text-white'
            : 'bg-white/80 text-slate-800 hover:bg-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('id')}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          language === 'id'
            ? 'bg-brand text-white'
            : 'bg-white/80 text-slate-800 hover:bg-white'
        }`}
      >
        ID
      </button>
    </div>
  );
}
