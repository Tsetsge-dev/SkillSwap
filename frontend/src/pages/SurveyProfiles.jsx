import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Users } from 'lucide-react';
import surveyProfiles from '../data/surveyProfiles.json';
import SurveyProfileCard from '../components/SurveyProfileCard';

const PAGE_SIZE = 24;

const SurveyProfiles = () => {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filteredProfiles = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return surveyProfiles;
    return surveyProfiles.filter((profile) => [
      profile.full_name,
      ...profile.skills_offered.map((skill) => skill.skill_name),
      ...profile.skills_wanted.map((skill) => skill.skill_name),
    ].some((value) => value.toLocaleLowerCase().includes(term)));
  }, [query]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900">
        <ArrowLeft className="h-4 w-4" /> Нүүр хуудас руу буцах
      </Link>

      <header className="rounded-[28px] bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-800 p-6 text-white shadow-lg shadow-indigo-950/10 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-200"><Users className="h-4 w-4" /> СУДАЛГААНД СУУРИЛСАН ЖИШЭЭ</div>
        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Суралцах сонирхлын жишээ профайлууд</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-indigo-100/90">
          Эдгээр нь судалгааны чадварын хариултаас үүсгэсэн, санамсаргүй Монгол нэртэй жишээ профайл юм. Бүртгэлтэй хүмүүс биш тул нэвтрэх, холбоо барих, санал илгээх боломжгүй.
        </p>
        <div className="mt-5 inline-flex rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold">{surveyProfiles.length} жишээ профайл</div>
      </header>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <label className="sr-only" htmlFor="survey-profile-search">Нэр эсвэл чадвараар хайх</label>
        <input id="survey-profile-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} placeholder="Нэр эсвэл чадвараар хайх" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
      </div>

      {filteredProfiles.length ? (
        <>
          <p className="text-xs text-slate-500">{filteredProfiles.length} жишээ олдлоо</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.slice(0, visibleCount).map((profile) => <SurveyProfileCard key={profile.id} profile={profile} />)}
          </div>
          {visibleCount < filteredProfiles.length && (
            <div className="flex justify-center pt-2">
              <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="rounded-xl border border-indigo-200 bg-white px-5 py-3 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Цааш харах ({filteredProfiles.length - visibleCount} үлдсэн)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Ийм нэр эсвэл чадвартай жишээ олдсонгүй.</div>
      )}
    </main>
  );
};

export default SurveyProfiles;
