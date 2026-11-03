import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-[#c8d7eb] bg-white p-0.5 shadow-sm ${compact ? 'text-[10px]' : 'text-xs'}`}
      role="group"
      aria-label={language === 'mn' ? 'Хэл сонгох' : 'Choose language'}
    >
      <button
        type="button"
        onClick={() => setLanguage('mn')}
        aria-pressed={language === 'mn'}
        className={`rounded-lg px-2 py-1 font-bold transition-colors ${language === 'mn' ? 'bg-[#5277aa] text-white' : 'text-[#385779] hover:bg-[#edf3fa]'}`}
      >
        MN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`rounded-lg px-2 py-1 font-bold transition-colors ${language === 'en' ? 'bg-[#5277aa] text-white' : 'text-[#385779] hover:bg-[#edf3fa]'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

