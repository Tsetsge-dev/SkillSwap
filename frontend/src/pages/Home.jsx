import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowRightLeft, CheckCircle2, Compass, Search } from "lucide-react";
import { matchesAPI } from "../services/api";
import UserCard from "../components/UserCard";
import MatchRequestModal from "../components/MatchRequestModal";

const Home = () => {
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);

  useEffect(() => {
    matchesAPI.explore({ limit: 6 })
      .then((res) => setFeaturedUsers(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const steps = [
    { number: "01", title: "Профайлаа бүрдүүл", description: "Заах болон сурахыг хүссэн чадвараа нэм." },
    { number: "02", title: "Түншээ сонго", description: "Тохирох хүнээ олоод солилцооны санал илгээ." },
    { number: "03", title: "Хамтдаа суралц", description: "Чат, уулзалтаар мэдлэг чадвараа солилц." },
  ];

  return (
    <div className="home-liquid-shell min-h-screen text-[#243b63]">
      <section className="-mt-4 mx-auto grid min-h-[calc(100svh-140px)] w-full max-w-[1660px] grid-cols-1 items-center gap-9 px-6 py-8 sm:px-10 lg:-mt-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-12 lg:py-10">
        <div className="-translate-y-4 max-w-[900px] lg:-translate-y-8 lg:pl-0">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#cbdaf0] bg-white/80 px-5 py-3 text-sm font-bold text-[#365984] shadow-sm">
            <ArrowRightLeft className="h-5 w-5" />
            Ур чадвараа харилцан солилцох нийгэмлэг
          </div>
          <h1 className="max-w-none text-4xl font-black leading-[1.12] tracking-[-0.045em] text-[#243b63] sm:text-[44px] lg:text-[46px]">
            Мэдлэгээ хуваалц.
            <span className="block text-[#456b9c]">Шинэ зүйл сур.</span>
          </h1>
          <p className="mt-5 max-w-[720px] text-sm leading-[1.75] text-[#3f5f89] sm:text-base">
            Мэддэг зүйлээ бусадтай хуваалцаж, сурахыг хүссэн чадвараа заадаг хүнээ олоорой.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/explore" className="home-primary-action inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl bg-[#456b9c] px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_-12px_#456b9c99] transition hover:-translate-y-0.5 hover:bg-[#365984]">
              <Search className="h-5 w-5" /> Тохирох хүн хайх <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/assessment" className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl border border-[#c7d7ed] bg-white px-5 text-sm font-bold text-[#29466f] transition hover:bg-[#edf3fb]">
              <Compass className="h-5 w-5 text-[#456b9c]" /> Сонирхлоо тодорхойлох
            </Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-[#456488]">Бүртгэлгүй юу? <Link className="home-register-action rounded-full bg-[#5277aa] px-3 py-1.5 font-extrabold text-white shadow-sm transition hover:bg-[#365984]" to="/register">Бүртгүүлэх</Link></p>
        </div>

        <div className="home-liquid-panel relative mx-auto w-full max-w-[780px] rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="home-liquid-badge inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-extrabold text-[#29466f]">
            <ArrowRightLeft className="h-5 w-5" /> ЖИШЭЭ СОЛИЛЦОО
          </div>
          <h2 className="mt-6 text-2xl font-black leading-tight tracking-tight text-[#243b63] sm:text-[28px]">Хүн бүр мэдлэг, чадвараа хуваалцана.</h2>

          <div className="home-liquid-card mt-7 rounded-[24px] px-6 py-5 sm:px-7">
            <p className="text-xs font-extrabold tracking-wide text-[#365984]">БИ ХУВААЛЦАНА</p>
            <p className="mt-2 text-xl font-extrabold text-[#29466f]">Англи хэл</p>
            <p className="mt-1.5 text-base text-[#456488]">Ярианы дадлага, шинэ үгс</p>
          </div>
          <div className="flex h-12 items-center justify-center text-[#5277aa]" aria-hidden="true"><ArrowRightLeft className="h-6 w-6 rotate-90" /></div>
          <div className="home-liquid-card rounded-[24px] px-6 py-5 sm:px-7">
            <p className="text-xs font-extrabold tracking-wide text-[#365984]">БИ СУРНА</p>
            <p className="mt-2 text-xl font-extrabold text-[#29466f]">Вэб дизайн</p>
            <p className="mt-1.5 text-base text-[#456488]">Эхний загвараа бүтээх</p>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#29466f]"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#456b9c]" /> Хоёр талдаа суралцах боломж</div>
          <div className="mt-3 flex items-center gap-3 text-sm font-semibold text-[#29466f]"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#456b9c]" /> Мөнгө төлөхгүй, чадвараараа солилцоно</div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-12 sm:px-10 lg:px-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-black tracking-[.2em] text-[#5277aa]">ЭНГИЙН 3 АЛХАМ</p>
          <h2 className="mt-3 text-2xl font-black text-[#243b63]">SkillSwap хэрхэн ажилладаг вэ?</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => <article key={step.number} className="home-liquid-card rounded-3xl p-7"><span className="text-sm font-black text-[#5277aa]">{step.number}</span><h3 className="mt-3 text-lg font-extrabold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#456488]">{step.description}</p></article>)}
        </div>
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-xl font-black">Санал болгож буй суралцагчид</h2><p className="mt-1 text-xs text-[#456488]">Тохирох хүнээ сонгоод солилцооны санал илгээгээрэй.</p></div><Link to="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-[#456b9c]">Бүгдийг харах <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{featuredUsers.map((user) => <UserCard key={user.id} user={user} onRequestSwap={setSelectedUserForSwap} />)}</div>
        </div>
      </section>
      {selectedUserForSwap && <MatchRequestModal isOpen targetUser={selectedUserForSwap} onClose={() => setSelectedUserForSwap(null)} onSuccess={() => setSelectedUserForSwap(null)} />}
    </div>
  );
};

export default Home;

