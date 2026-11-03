import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

const DEMO_ACCOUNTS = [
  { name: 'Билгүүн', role: 'Python хөгжүүлэгч', email: 'alex.chen@skillswap.io' },
  { name: 'Ариунзаяа', role: 'Япон хэлний багш', email: 'yuki.tanaka@skillswap.io' },
  { name: 'Энхжин', role: 'UI/UX Дизайнер', email: 'elena.rostova@skillswap.io' },
  { name: 'Тэмүүлэн', role: 'Хөгжмийн продюсер', email: 'marcus.vance@skillswap.io' },
  { name: 'Номин', role: 'Маркетинг мэргэжилтэн', email: 'sophia.martinez@skillswap.io' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Имэйл эсвэл нууц үг буруу байна.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      navigate('/');
    } catch (err) {
      setError('Демо нэвтрэлт амжилтгүй боллоо.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[750px] space-y-6">

        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-[#c9d8ec] bg-white/80 px-4 py-2 text-sm font-bold text-[#315f9d] shadow-sm transition hover:bg-white">
          <ArrowLeft className="h-4 w-4" /> Нүүр цэс рүү буцах
        </Link>

        {/* Logo */}
        <div className="text-left">
          <BrandLogo className="mb-5 h-12 w-auto max-w-[190px]" />
          <h1 className="text-3xl font-extrabold text-slate-800">Нэвтрэх</h1>
          <p className="mt-2 text-sm text-slate-600">Чадвар солилцооны платформд тавтай морил</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-panel space-y-5 rounded-[28px] p-6 sm:p-10">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Имэйл хаяг</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="имэйл@example.com"
                required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Нууц үг</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#5277aa] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#365984] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{loading ? 'Нэвтэрж байна...' : 'Нэвтрэх'}</span>
          </button>

          <p className="text-center text-xs text-slate-500">
            Бүртгэлгүй юу?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:underline">
              Бүртгүүлэх
            </Link>
          </p>
        </form>

        {/* Quick Demo Login */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" /> Шууд туршиж үзэх
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleDemoLogin(acc.email)}
                disabled={loading}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 hover:bg-violet-50 border border-slate-200 text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 group-hover:text-violet-600 transition-colors">
                    {acc.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{acc.role}</span>
                </div>
                <LogIn className="w-3 h-3 text-slate-400 group-hover:text-violet-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

