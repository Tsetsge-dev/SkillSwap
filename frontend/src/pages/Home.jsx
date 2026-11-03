import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowRightLeft, Bot, CheckCircle2, Compass, Search, Users } from "lucide-react";
import { matchesAPI } from "../services/api";
import UserCard from "../components/UserCard";
import MatchRequestModal from "../components/MatchRequestModal";

const Home = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#f4f7fc] text-[#243b63]">
      <section className="mx-auto grid min-h-[calc(100svh-100px)] w-full max-w-[1660px] grid-cols-1 items-center gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:py-16">
        <div className="max-w-[760px] lg:pl-0">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#cbdaf0] bg-white/80 px-5 py-3 text-sm font-bold text-[#456b9c] shadow-sm">
            <ArrowRightLeft className="h-5 w-5" />
            Ур чадвараа харилцан солилцох нийгэмлэг
          </div>
          <h1 className="max-w-[760px] text-5xl font-black leading-[1.12] tracking-[-0.045em] text-[#243b63] sm:text-6xl lg:text-[76px]">
            Мэдлэгээ хуваалц.
            <span className="block text-[#456b9c]">Шинэ зүйл сур.</span>
          </h1>
          <p className="mt-7 max-w-[720px] text-lg leading-[1.8] text-[#49688f] sm:text-[21px]">
            Мэддэг зүйлээ бусадтай хуваалцаж, сурахыг хүссэн чадвараа заадаг хүнээ олоорой.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/explore" className="inline-flex min-h-[72px] items-center justify-center gap-3 rounded-2xl bg-[#456b9c] px-7 text-lg font-extrabold text-white shadow-[0_12px_24px_-12px_#456b9c99] transition hover:-translate-y-0.5 hover:bg-[#365984]">
              <Search className="h-6 w-6" /> Тохирох хүн хайх <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/assessment" className="inline-flex min-h-[72px] items-center justify-center gap-3 rounded-2xl border border-[#c7d7ed] bg-white px-7 text-lg font-bold text-[#29466f] transition hover:bg-[#edf3fb]">
              <Compass className="h-6 w-6 text-[#456b9c]" /> Сонирхлоо тодорхойлох
            </Link>
          </div>
          <p className="mt-6 text-base text-[#5d789d]">Шинээр орж ирэв үү? <Link className="font-extrabold text-[#456b9c] hover:underline" to="/register">Бүртгүүлэх</Link></p>
        </div>

        <div className="relative mx-auto w-full max-w-[780px] rounded-[48px] border border-[#d0def0] bg-white/65 p-7 shadow-[0_28px_80px_-50px_#29466f55] backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="inline-flex items-center gap-3 rounded-full bg-[#f5f8fc] px-5 py-3 text-base font-extrabold text-[#29466f]">
            <ArrowRightLeft className="h-5 w-5" /> ЖИШЭЭ СОЛИЛЦОО
          </div>
          <h2 className="mt-7 text-3xl font-black leading-tight tracking-tight text-[#243b63] sm:text-[36px]">Хүн бүр мэдлэг, чадвараа хуваалцана.</h2>

          <div className="mt-8 rounded-[26px] border border-[#d0def0] bg-white px-7 py-7 shadow-[0_10px_30px_-24px_#29466f55] sm:px-8">
            <p className="text-sm font-extrabold tracking-wide text-[#456b9c]">БИ ХУВААЛЦАНА</p>
            <p className="mt-2 text-2xl font-extrabold text-[#29466f]">Англи хэл</p>
            <p className="mt-2 text-lg text-[#5d789d]">Ярианы дадлага, шинэ үгс</p>
          </div>
          <div className="flex h-16 items-center justify-center text-[#7892b4]" aria-hidden="true"><ArrowRightLeft className="h-7 w-7 rotate-90" /></div>
          <div className="rounded-[26px] border border-[#d0def0] bg-white px-7 py-7 shadow-[0_10px_30px_-24px_#29466f55] sm:px-8">
            <p className="text-sm font-extrabold tracking-wide text-[#456b9c]">БИ СУРНА</p>
            <p className="mt-2 text-2xl font-extrabold text-[#29466f]">Вэб дизайн</p>
            <p className="mt-2 text-lg text-[#5d789d]">Эхний загвараа бүтээх</p>
          </div>
          <div className="mt-7 flex items-center gap-3 text-base font-medium text-[#29466f]"><CheckCircle2 className="h-6 w-6 shrink-0" /> Хоёр талдаа суралцах боломж</div>
          <div className="mt-4 flex items-center gap-3 text-base font-medium text-[#29466f]"><CheckCircle2 className="h-6 w-6 shrink-0" /> Мөнгө төлөхгүй, чадвараараа солилцоно</div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-12 sm:px-10 lg:px-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-black tracking-[.2em] text-[#5277aa]">ЭНГИЙН 3 АЛХАМ</p>
          <h2 className="mt-3 text-3xl font-black text-[#243b63]">SkillSwap хэрхэн ажилладаг вэ?</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => <article key={step.number} className="rounded-3xl border border-[#d5e0ef] bg-white p-7 shadow-sm"><span className="text-sm font-black text-[#5277aa]">{step.number}</span><h3 className="mt-3 text-lg font-extrabold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#5d789d]">{step.description}</p></article>)}
        </div>
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-2xl font-black">Санал болгож буй суралцагчид</h2><p className="mt-1 text-sm text-[#5d789d]">Тохирох хүнээ сонгоод солилцооны санал илгээгээрэй.</p></div><Link to="/explore" className="inline-flex items-center gap-2 font-bold text-[#456b9c]">Бүгдийг харах <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{featuredUsers.map((user) => <UserCard key={user.id} user={user} onRequestSwap={setSelectedUserForSwap} />)}</div>
        </div>
      </section>
      {selectedUserForSwap && <MatchRequestModal isOpen targetUser={selectedUserForSwap} onClose={() => setSelectedUserForSwap(null)} onSuccess={() => setSelectedUserForSwap(null)} />}
    </div>
  );
};

export default Home;

