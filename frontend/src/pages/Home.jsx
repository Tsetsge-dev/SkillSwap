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
  );
};

export default Home;
