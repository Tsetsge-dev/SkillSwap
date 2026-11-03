import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-slate-200 bg-white/90 p-0.5 shadow-sm ${compact ? 'text-[10px]' : 'text-xs'}`}
      role="group"
      aria-label={language === 'mn' ? 'Хэл сонгох' : 'Choose language'}
    >
      <button
        type="button"
        onClick={() => setLanguage('mn')}
        aria-pressed={language === 'mn'}
        className={`rounded-lg px-2 py-1 font-bold transition-colors ${language === 'mn' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        MN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`rounded-lg px-2 py-1 font-bold transition-colors ${language === 'en' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
