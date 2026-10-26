import React from "react";
import { ArrowRightLeft, Compass, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-700 text-white"><ArrowRightLeft className="h-4 w-4" aria-hidden="true" /></span>
            Skill<span className="text-indigo-700">Swap</span>
          </Link>
          <p className="mt-2 text-xs text-slate-500">Мэдлэгээ хуваалцаж, хамтдаа суралцъя.</p>
        </div>
        <nav aria-label="Нэмэлт холбоос" className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
          <Link to="/explore" className="inline-flex items-center gap-1.5 rounded-md transition hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><Search className="h-3.5 w-3.5" aria-hidden="true" />Хүмүүс</Link>
          <Link to="/assessment" className="inline-flex items-center gap-1.5 rounded-md transition hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><Compass className="h-3.5 w-3.5" aria-hidden="true" />Сонирхлоо тодорхойлох</Link>
        </nav>
        <div className="flex flex-col gap-2 text-[11px] md:items-end">
          <p className="font-medium text-slate-600"><span className="font-bold text-indigo-800">Б. Цэцэгжаргал, Б. Чимэддорж</span> нар SkillSwap-ийг <span className="font-bold text-indigo-800">Girls&lt;/&gt;BoysCode2026</span> хөтөлбөрийн хүрээнд бүтээв.</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500">
            <span className="font-semibold text-slate-600">Холбоо барих:</span>
            <a href="tel:+97685757578" className="rounded-sm font-semibold text-indigo-700 underline-offset-2 transition hover:text-indigo-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">+976 8575 7578</a>
          </div>
          <span className="text-slate-400">© {new Date().getFullYear()} SkillSwap</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
