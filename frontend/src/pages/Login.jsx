<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightLeft, LogIn, Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { name: 'Билгүүн', role: 'Python хөгжүүлэгч', email: 'alex.chen@skillswap.io' },
  { name: 'Ариунзаяа', role: 'Япон хэлний багш', email: 'yuki.tanaka@skillswap.io' },
  { name: 'Энхжин', role: 'UI/UX Дизайнер', email: 'elena.rostova@skillswap.io' },
  { name: 'Тэмүүлэн', role: 'Хөгжмийн продюсер', email: 'marcus.vance@skillswap.io' },
  { name: 'Номин', role: 'Маркетинг мэргэжилтэн', email: 'sophia.martinez@skillswap.io' },
];
=======
import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { getAuthErrorMessage, validateEmail } from '../services/authValidation';
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD
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
=======
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const busy = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy.current) return;
    if (!validateEmail(email)) {
      setEmailError('Зөв имэйл хаяг оруулна уу.');
      return;
    }
    setEmailError('');
    setError('');
    busy.current = true;
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from || '/', { replace: true });
    } catch (authError) {
      setError(getAuthErrorMessage(authError, 'login'));
    } finally {
      busy.current = false;
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 border border-violet-400/40 flex items-center justify-center text-white shadow-md">
              <ArrowRightLeft className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              Skill<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Swap</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Нэвтрэх</h1>
          <p className="text-xs text-slate-500 mt-1">Чадвар солилцооны платформд тавтай морил</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Имэйл</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="имэйл@example.com"
                required
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Нууц үг</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-md btn-shimmer animate-sparkle-in"
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
=======
    <AuthLayout mode="login">
      <div className="auth-heading">
        <span className="auth-heading-icon"><LockKeyhole size={21} /></span>
        <span className="auth-eyebrow">ТАВТАЙ МОРИЛ</span>
        <h1>SkillSwap-д нэвтрэх</h1>
        <p>Бүртгэлдээ нэвтэрч, суралцахаа үргэлжлүүлээрэй.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-alert auth-alert-error" role="alert">{error}</div>}
        <div className="auth-field">
          <label htmlFor="login-email">Имэйл хаяг</label>
          <div className="auth-input-wrap"><Mail size={17} aria-hidden="true" /><input id="login-email" type="email" name="email" value={email} onChange={(event) => { setEmail(event.target.value); setEmailError(''); }} placeholder="name@example.com" autoComplete="email" autoCapitalize="none" required aria-invalid={!!emailError} aria-describedby={emailError ? 'login-email-error' : undefined} /></div>
          {emailError && <span className="auth-field-error" id="login-email-error">{emailError}</span>}
        </div>
        <div className="auth-field">
          <div className="auth-label-row"><label htmlFor="login-password">Нууц үг</label><button type="button" className="auth-text-button" onClick={() => setRecoveryOpen((open) => !open)} aria-expanded={recoveryOpen}>Нууц үгээ мартсан уу?</button></div>
          <div className="auth-input-wrap"><KeyRound size={17} aria-hidden="true" /><input id="login-password" type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Нууц үгээ оруулна уу" autoComplete="current-password" required /><button className="auth-visibility" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Нууц үг нуух' : 'Нууц үг харах'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        </div>
        {recoveryOpen && <div className="auth-alert auth-alert-info" role="status">Нууц үг сэргээх үйлчилгээ одоогоор идэвхгүй байна. Тусламж авахын тулд платформын админтай холбогдоно уу.</div>}
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><span className="auth-spinner" /> Нэвтэрч байна…</> : <>Нэвтрэх <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">Шинээр бүртгүүлэх үү? <Link to="/register">Бүртгэл үүсгэх</Link></p>
    </AuthLayout>
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  );
};

export default Login;
