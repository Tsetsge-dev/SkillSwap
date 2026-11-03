<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  Sparkles,
  Bot,
  Search,
  Users,
  ArrowRight,
  Activity,
} from "lucide-react";
import { matchesAPI } from "../services/api";
import UserCard from "../components/UserCard";
import MatchRequestModal from "../components/MatchRequestModal";
import FloatingSkillIcons from "../components/FloatingSkillIcons";

const Home = () => {
  const navigate = useNavigate();
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [searchTeach, setSearchTeach] = useState("");
  const [searchLearn, setSearchLearn] = useState("");

  useEffect(() => {
    matchesAPI
      .explore({ limit: 6 })
      .then((res) => setFeaturedUsers(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTeach) params.append("teach_skill", searchTeach);
    if (searchLearn) params.append("learn_skill", searchLearn);
    navigate(`/explore?${params.toString()}`);
  };

  const categories = [
    "Програмчлал & IT",
    "Гадаад хэл",
    "Дизайн & Бүтээлч",
    "Хөгжим & Аудио",
    "Бизнес & Маркетинг",
    "Эрүүл мэнд & Иог",
  ];

  return (
    <>
      <div className="space-y-16 pb-16">
        {/* Hero Section */}
        <section className="relative pt-12 md:pt-20 text-center px-4 max-w-4xl mx-auto min-h-[360px]">
          <FloatingSkillIcons />
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-600 text-xs font-semibold mb-6 animate-fade-in-up animate-border-pulse"
            style={{ animationDelay: "0.1s" }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-sparkle-in" />
            <span>Skill Swap платформ</span>
          </div>

          {/* Live learners status pill — animated to draw attention */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="font-medium">
                Онлайн суралцагчид: <b className="text-emerald-600">127</b>
              </span>
              <Activity
                className="w-3 h-3 text-emerald-500 animate-pulse-dot"
                style={{ animationDuration: "2.6s" }}
              />
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-4 stagger-children">
            <span
              className="animate-fade-in-shimmer"
              style={{ animationDelay: "0.1s" }}
            >
              Өөрийн чадвараа зааж,{" "}
            </span>
            <br />
            <span
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent animate-fade-in-shimmer"
              style={{ animationDelay: "0.2s" }}
            >
              хүссэн бүхнээ
            </span>
            <span
              className="animate-fade-in-shimmer"
              style={{ animationDelay: "0.3s" }}
            >
              {" "}
              үнэгүй сур.
            </span>
          </h1>

          <p
            className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mb-8 font-normal leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Програмчлал заагаад Япон хэл сурах, Дизайн заагаад Гитар тоглож
            сурах зэргээр бие биедээ 1-on-1 туслан хамтдаа хөгжье.
          </p>

          {/* Minimal Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form
              onSubmit={handleQuickSearch}
              className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                <span className="text-xs font-semibold text-violet-600 shrink-0">
                  Би заана:
                </span>
                <input
                  type="text"
                  placeholder="ж нь: Python, Дизайн..."
                  value={searchTeach}
                  onChange={(e) => setSearchTeach(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                <span className="text-xs font-semibold text-sky-600 shrink-0">
                  Би сурна:
                </span>
                <input
                  type="text"
                  placeholder="ж нь: Япон хэл, Гитар..."
                  value={searchLearn}
                  onChange={(e) => setSearchLearn(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 glow-accent text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Хайх</span>
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <Link
              to="/recommendations"
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 transition-colors animate-fade-in-up shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Танд тохирох чадвараа олох</span>
            </Link>
            <Link
              to="/chatbot"
              className="px-4 py-2 rounded-xl bg-white/80 hover:bg-violet-50 border border-slate-200 text-slate-700 flex items-center gap-2 transition-colors animate-fade-in-up shadow-sm"
            >
              <Bot className="w-4 h-4 text-violet-500" />
              <span>AI-аар тохирох хүн хайх</span>
            </Link>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-violet-600 transition-colors animate-fade-in-up"
            >
              Бүх хэрэглэгчид →
            </Link>
          </div>
        </section>

        {/* Category Pills */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 stagger-children">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/explore?category=${encodeURIComponent(cat)}`}
                className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-violet-50 text-slate-600 hover:text-violet-600 text-xs font-medium border border-slate-200 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* Recommended Partners */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Санал болгож буй суралцагчид
              </h2>
              <p className="text-xs text-slate-500">
                Өндөр тохиролтой хүмүүс рүү шууд санал илгээнэ үү
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-bold text-violet-500 hover:text-violet-700 hover:underline flex items-center gap-1 animate-fade-in-up"
            >
              <span>Бүгдийг харах</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {featuredUsers.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                onRequestSwap={(target) => setSelectedUserForSwap(target)}
              />
            ))}
          </div>
        </section>

        {/* Request Modal */}
        {selectedUserForSwap && (
          <MatchRequestModal
            isOpen={!!selectedUserForSwap}
            targetUser={selectedUserForSwap}
            onClose={() => setSelectedUserForSwap(null)}
            onSuccess={() => setSelectedUserForSwap(null)}
          />
        )}
      </div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute top-0 right-0 -ml-10 -mr-10 opacity-50">
        <div className="w-64 h-64 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-float animate-gentle-bob md:top-20 md:right-10 lg:top-32 lg:right-20"></div>
        <div
          className="w-32 h-32 rounded-full bg-sky-500/10 border border-sky-500/20 animate-float animate-gentle-bob lg:top-40 lg:right-40"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 animate-float animate-gentle-bob lg:top-60 lg:right-60"
          style={{ animationDelay: "3s" }}
        ></div>
        <svg
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-emerald-500/20 animate-wave"
          viewBox="0 0 100 30"
        >
          <path d="M0,5 Q20,0 Q40,20 Q60,5 Q80,25 Q100,5" fill="currentColor" />
        </svg>
      </div>
    </>
=======
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowRightLeft,
  CheckCircle2,
  Compass,
  Search,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { matchesAPI } from "../services/api";
import UserCard from "../components/UserCard";
import MatchRequestModal from "../components/MatchRequestModal";

const PAGE_SIZE = 6;

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState(false);

  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);
    setMembersError(false);
    try {
      const response = await matchesAPI.explore();
      setMembers(Array.isArray(response.data) ? response.data : []);
    } catch {
      setMembersError(true);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const registerOrProfilePath = isAuthenticated ? "/profile" : "/register";

  return (
    <main className="overflow-hidden bg-transparent pb-16">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-2 text-xs font-bold text-indigo-800 shadow-sm">
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              Ур чадвараа харилцан солилцох нийгэмлэг
            </div>
            <h1 className="home-main-heading mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem]">
              Мэдлэгээ хуваалц. <span className="text-indigo-700">Шинэ зүйл сур.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Мэддэг зүйлээ бусадтай хуваалцаж, сурахыг хүссэн чадвараа заадаг хүнээ олоорой.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/explore"
                className="home-primary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-700/20 transition hover:-translate-y-0.5 hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Тохирох хүн хайх
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/assessment"
                className="home-secondary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                <Compass className="h-4 w-4 text-indigo-700" aria-hidden="true" />
                Сонирхлоо тодорхойлох
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              {isAuthenticated ? (
                <Link to="/profile" className="font-semibold text-indigo-700 underline-offset-4 hover:underline">Профайлаа шинэчлэх</Link>
              ) : (
                <>Шинээр орж ирэв үү? <Link to="/register" className="font-semibold text-indigo-700 underline-offset-4 hover:underline">Бүртгүүлэх</Link></>
              )}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/60 via-blue-100/35 to-transparent blur-2xl" />
            <div className="glass-hero home-exchange-panel relative overflow-hidden rounded-[1.75rem] p-6 sm:rounded-[2rem] sm:p-8">
              <div aria-hidden="true" className="absolute -right-16 -top-20 h-48 w-48 rounded-full border border-white/10 shadow-[0_0_0_24px_rgba(232,235,242,.035),0_0_0_48px_rgba(232,235,242,.025)]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-indigo-100">
                  <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  ЖИШЭЭ СОЛИЛЦОО
                </div>
                <h2 className="home-exchange-heading mt-4 max-w-sm text-xl font-bold leading-snug text-white sm:text-2xl">Хүн бүр мэдлэг, чадвараа хуваалцана.</h2>
                <div className="mt-6 space-y-3">
                  <div className="home-exchange-card rounded-2xl border border-white/70 bg-white p-4 shadow-lg shadow-slate-950/10 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Би хуваалцана</p>
                    <p className="mt-1 text-base font-bold text-slate-900">Англи хэл</p>
                    <p className="mt-1 text-xs text-slate-500">Ярианы дадлага, шинэ үгс</p>
                  </div>
                  <div className="flex justify-center" aria-hidden="true"><ArrowRightLeft className="h-5 w-5 rotate-90 text-blue-200" /></div>
                  <div className="home-exchange-card rounded-2xl border border-white/70 bg-white p-4 shadow-lg shadow-slate-950/10 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Би сурна</p>
                    <p className="mt-1 text-base font-bold text-slate-900">Вэб дизайн</p>
                    <p className="mt-1 text-xs text-slate-500">Эхний загвараа бүтээх</p>
                  </div>
                </div>
                <div className="home-exchange-note mt-5 flex items-center gap-2 text-xs font-medium text-indigo-100">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Хоёр талдаа суралцах боломж
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="about-skillswap-title">
        <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/85 px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Товч танилцуулга</p>
            <h2 id="about-skillswap-title" className="mt-1 text-xl font-black tracking-tight text-slate-950">SkillSwap гэж юу вэ?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">SkillSwap нь мэддэг зүйлээ бусадтай хуваалцаж, тэднээс шинэ чадвар сурах боломж олгодог платформ юм.</p>
          </div>
          <Link to="/explore" className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-800 transition hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 sm:self-center">
            Хүмүүс хайх <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14" aria-labelledby="member-profiles-title">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Нийгэмлэг</p>
            <h2 id="member-profiles-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Бүртгэлтэй суралцагчид</h2>
            <p className="mt-2 text-sm text-slate-600">Профайлаа нийтэд харагдахаар тохируулсан гишүүдийг энд харуулна.</p>
          </div>
          <Link to="/explore" className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
            Хайлт, шүүлтүүр нээх <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {loadingMembers ? (
          <div role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">Профайлуудыг ачаалж байна…</div>
        ) : membersError ? (
          <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm font-semibold text-amber-950">Профайлуудыг одоогоор ачаалж чадсангүй.</p>
            <button type="button" onClick={loadMembers} className="mt-3 rounded-lg px-3 py-2 text-sm font-bold text-amber-900 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">Дахин оролдох</button>
          </div>
        ) : members.length > 0 ? (
          <>
            <div className="mb-4 text-xs font-medium text-slate-500">{members.length} нийтэд харагдах профайл</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {members.slice(0, visibleCount).map((member) => (
                <UserCard key={member.id} user={member} onRequestSwap={setSelectedMember} />
              ))}
            </div>
            {visibleCount < members.length && (
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
                  Цааш харах ({members.length - visibleCount} үлдсэн) <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700"><Users className="h-6 w-6" aria-hidden="true" /></div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Одоогоор нийтэд харагдах профайл алга</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Эхний гишүүдийн нэг болж, зааж болон сурахыг хүссэн чадвараа профайлдаа нэмээрэй.</p>
            <Link to={registerOrProfilePath} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
              {isAuthenticated ? "Профайлдаа чадвар нэмэх" : "Профайл үүсгэх"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      {selectedMember && (
        <MatchRequestModal
          isOpen={!!selectedMember}
          targetUser={selectedMember}
          onClose={() => setSelectedMember(null)}
          onSuccess={() => setSelectedMember(null)}
        />
      )}
    </main>
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  );
};

export default Home;
