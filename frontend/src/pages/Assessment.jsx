import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  Loader2,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { assessmentAPI } from "../services/api";
import { assessmentQuestions, scoreRecommendations, skillCatalog } from "../data/recommendations";

const STORAGE_KEY = "skillswap_assessment_answers";

const Assessment = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Бүгд");
  const [query, setQuery] = useState("");

  const current = assessmentQuestions[step];
  const progress = Math.round(((step + 1) / assessmentQuestions.length) * 100);
  const selected = answers[current.id] || (current.type === "multi" ? [] : "");

  const categories = useMemo(() => ["Бүгд", ...new Set(skillCatalog.map((skill) => skill.category))], []);
  const visibleSkills = skillCatalog.filter((skill) => {
    const matchesCategory = filter === "Бүгд" || skill.category === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      skill.name.toLowerCase().includes(q) ||
      skill.category.toLowerCase().includes(q) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const isValid = () => {
    const value = answers[current.id];
    if (current.type === "multi") return Array.isArray(value) && value.length >= (current.min || 1);
    return Boolean(value);
  };

  const updateAnswer = (value) => {
    setError("");
    setAnswers((prev) => {
      if (current.type === "multi") {
        const existing = prev[current.id] || [];
        const next = existing.includes(value)
          ? existing.filter((item) => item !== value)
          : [...existing, value];
        return { ...prev, [current.id]: next };
      }
      return { ...prev, [current.id]: value };
    });
  };

  const handleNext = () => {
    if (!isValid()) {
      setError(
        current.type === "multi"
          ? `Дор хаяж ${current.min || 1} сонголт сонгоно уу.`
          : "Үргэлжлүүлэхийн өмнө нэг сонголт сонгоно уу."
      );
      return;
    }

    if (step < assessmentQuestions.length - 1) {
      setStep((value) => value + 1);
      return;
    }

    submitAssessment();
  };

  const submitAssessment = async () => {
    setStatus("loading");
    setError("");
    const localResults = scoreRecommendations(answers);

    try {
      const response = await assessmentAPI.recommend(answers);
      setResults(response.data.recommendations?.length ? response.data.recommendations : localResults);
      setStatus("done");
    } catch {
      setResults(localResults);
      setStatus("done");
      setError("Сервертэй холбогдож чадсангүй. Таны хариултад тулгуурлан түр зөвлөмж гаргалаа.");
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setResults(null);
    setStep(0);
    setStatus("idle");
    setError("");
    localStorage.removeItem(STORAGE_KEY);
  };

  if (results) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <section className="rounded-[28px] bg-white/92 border border-slate-200 shadow-xl shadow-slate-200/60 p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Таны хувийн зөвлөмж бэлэн боллоо
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
                  Танд тохирох чиглэлүүд
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed">
                  Энэ оноо нь таны сонгосон сонирхол, давуу тал, сурах хэв маяг, ойрын зорилгод тулгуурласан зөвлөмжийн оноо юм.
                  Сэтгэлзүйн онош биш, эхлэх чиглэлээ тодруулахад туслах зураглал гэж ойлгоорой.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetAssessment}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Дахин бөглөх
              </button>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Хамт сурах хүн хайх
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-medium text-amber-800">
              {error}
            </p>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
          <div className="space-y-4">
            {results.map((rec, index) => (
              <article
                key={rec.id}
                className="bg-white/94 border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-200/55"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-black">
                        #{index + 1}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                        {rec.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                        {rec.level}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">{rec.name}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{rec.explanation}</p>
                  </div>
                  <div className="shrink-0 w-24 h-24 rounded-2xl bg-slate-950 text-white grid place-items-center shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-black">{rec.score}%</div>
                      <div className="text-[10px] text-slate-300 font-bold">тохироо</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-black text-slate-800 mb-2">Яагаад тохирч байна вэ?</h3>
                    <ul className="space-y-2">
                      {rec.reasons.map((reason) => (
                        <li key={reason} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-black text-slate-800 mb-2">Эхлэх боломж</h3>
                    <ol className="space-y-2">
                      {rec.nextSteps.map((item, idx) => (
                        <li key={item} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-[10px] font-black text-slate-700 grid place-items-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {rec.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="bg-white/94 border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-200/55 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-950">Нууцлал ба хэрэглээ</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Асуулгын хариу таны төхөөрөмж дээр хадгалагдаж, зөвлөмж гаргахад л ашиглагдана. Нэр, имэйл, хувийн мэдээлэл шаардахгүй.
            </p>
            <div className="mt-5 rounded-xl bg-slate-950 text-white p-4">
              <p className="text-xs text-slate-300">Дараагийн алхам</p>
              <p className="mt-1 text-sm font-bold leading-relaxed">
                Хамгийн өндөр оноотой 1 чиглэлээр 7 хоногийн жижиг туршилт эхлүүлээд SkillSwap дээр хамтрах хүн хайгаарай.
              </p>
            </div>
          </aside>
        </section>

        <SkillExplorer
          categories={categories}
          filter={filter}
          setFilter={setFilter}
          query={query}
          setQuery={setQuery}
          visibleSkills={visibleSkills}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
        <div className="rounded-[28px] bg-slate-950 text-white p-6 sm:p-8 shadow-xl overflow-hidden relative">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              SkillSwap чиглэл тодорхойлогч
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Өөрт тохирох ур чадвараа олоорой.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Сонирхол, давуу тал, сурах хэв маяг, зорилгод тань тулгуурлан эхлэхэд хамгийн тохиромжтой чиглэлүүдийг санал болгоно.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["6 асуулт", "5 зөвлөмж", "Нууцлалтай"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/8 border border-white/10 p-3">
                  <p className="text-xs font-bold text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full border border-white/10" />
          <div className="absolute right-8 bottom-8 w-24 h-24 rounded-2xl bg-white/8 rotate-6" />
        </div>

        <div className="bg-white/94 border border-slate-200 rounded-[28px] p-5 sm:p-7 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-black text-indigo-600">
                Асуулт {step + 1} / {assessmentQuestions.length}
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-950">{current.title}</h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">{current.helper}</p>
            </div>
            <div className="hidden sm:grid place-items-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 font-black">
              {progress}%
            </div>
          </div>

          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-5">
            <div className="h-full rounded-full bg-slate-950 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.options.map((option) => {
              const active = current.type === "multi" ? selected.includes(option.value) : selected === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateAnswer(option.value)}
                  className={`text-left min-h-16 rounded-2xl border px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                    active
                      ? "bg-slate-950 border-slate-950 text-white shadow-lg"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border grid place-items-center shrink-0 ${
                        active ? "border-white bg-white text-slate-950" : "border-slate-300"
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-sm font-bold leading-snug">{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-bold text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0 || status === "loading"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Буцах
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold transition-colors"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Боловсруулж байна...
                </>
              ) : step === assessmentQuestions.length - 1 ? (
                <>
                  Зөвлөмж харах
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Дараах
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <SkillExplorer
        categories={categories}
        filter={filter}
        setFilter={setFilter}
        query={query}
        setQuery={setQuery}
        visibleSkills={visibleSkills}
      />
    </div>
  );
};

const SkillExplorer = ({ categories, filter, setFilter, query, setQuery, visibleSkills }) => (
  <section className="bg-white/80 border border-slate-200 rounded-[28px] p-5 sm:p-7 shadow-lg shadow-slate-200/50">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
      <div>
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-black">
          <Target className="w-4 h-4" />
          Ур чадварууд
        </div>
        <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-950">Сонирхож үзэх чадварууд</h2>
        <p className="mt-1 text-xs text-slate-500">Зөвлөмжөөс гадна бусад чадварыг хайж, шүүж үзээрэй.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        <label className="relative flex-1 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ур чадвар хайх..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </label>
        <label className="relative">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="appearance-none w-full sm:w-44 rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </label>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {visibleSkills.map((skill) => (
        <article key={skill.id} className="rounded-2xl bg-white border border-slate-200 p-4 hover:-translate-y-1 hover:shadow-lg transition-all">
          <p className="text-[11px] font-black text-indigo-600">{skill.category}</p>
          <h3 className="mt-1 text-base font-black text-slate-950">{skill.name}</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">{skill.explanation}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skill.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Assessment;
