<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightLeft, UserPlus, Mail, Lock, User } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Нууц үг таарахгүй байна.');
      return;
    }
    if (form.password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({ full_name: form.full_name, email: form.email, password: form.password });
      await login(form.email, form.password);
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === 'string' ? msg : 'Бүртгэл амжилтгүй боллоо. Имэйл бүртгэлтэй байж магадгүй.');
    } finally {
=======
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, EyeOff, KeyRound, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { getAuthErrorMessage, passwordChecks, validateRegistration } from '../services/authValidation';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ last_name: '', first_name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);
  const checks = passwordChecks(form.password);
  const strength = checks.filter((item) => item.valid).length;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy.current) return;
    const validationError = validateRegistration(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    busy.current = true;
    setLoading(true);
    setError('');
    try {
      await register({
        full_name: `${form.last_name.trim()} ${form.first_name.trim()}`,
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/profile', { replace: true, state: { welcome: true } });
    } catch (authError) {
      setError(getAuthErrorMessage(authError, 'register'));
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

        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 border border-violet-400/40 flex items-center justify-center text-white shadow-md">
              <ArrowRightLeft className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              Skill<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Swap</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Бүртгүүлэх</h1>
          <p className="text-xs text-slate-500 mt-1">Чадвар солилцоонд нэгдээрэй</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Бүтэн нэр</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Таны нэр" required
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Имэйл</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="имэйл@example.com" required
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Нууц үг</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="6+ тэмдэгт" required
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Нууц үг давтах</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-md btn-shimmer animate-sparkle-in">
            <UserPlus className="w-3.5 h-3.5" />
            <span>{loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}</span>
          </button>

          <p className="text-center text-xs text-slate-500">
            Бүртгэлтэй юу?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Нэвтрэх</Link>
          </p>
        </form>
      </div>
    </div>
=======
    <AuthLayout mode="register">
      <div className="auth-heading">
        <span className="auth-heading-icon"><UserRound size={21} /></span>
        <span className="auth-eyebrow">ШИНЭЭР НЭГДЭХ</span>
        <h1>Шинэ бүртгэл үүсгэх</h1>
        <p>Мэддэг зүйлээ бусдад зааж, сурахыг хүссэн зүйлээ хамтдаа эзэмшээрэй.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-alert auth-alert-error" role="alert">{error}</div>}
        <div className="auth-field">
          <label htmlFor="register-last-name">Овог</label>
          <div className="auth-input-wrap"><UserRound size={17} aria-hidden="true" /><input id="register-last-name" type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Овгоо оруулна уу" autoComplete="family-name" maxLength={60} required /></div>
        </div>
        <div className="auth-field">
          <label htmlFor="register-first-name">Нэр</label>
          <div className="auth-input-wrap"><UserRound size={17} aria-hidden="true" /><input id="register-first-name" type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Нэрээ оруулна уу" autoComplete="given-name" maxLength={60} required /></div>
        </div>
        <div className="auth-field">
          <label htmlFor="register-email">Имэйл хаяг</label>
          <div className="auth-input-wrap"><Mail size={17} aria-hidden="true" /><input id="register-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" autoComplete="email" autoCapitalize="none" required /></div>
        </div>
        <div className="auth-field">
          <label htmlFor="register-password">Нууц үг</label>
          <div className="auth-input-wrap"><KeyRound size={17} aria-hidden="true" /><input id="register-password" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Шинэ нууц үг" autoComplete="new-password" required /><button className="auth-visibility" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Нууц үг нуух' : 'Нууц үг харах'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
          <div className="auth-strength" aria-live="polite"><div className="auth-strength-bars" aria-label={`Нууц үгийн хүч: ${strength} / 3`}>{checks.map((item, index) => <span key={item.label} className={index < strength ? 'is-filled' : ''} />)}</div><span>{form.password ? (strength === 3 ? 'Сайн нууц үг' : 'Нууц үгээ сайжруулаарай') : 'Хүчтэй нууц үг үүсгээрэй'}</span></div>
          <ul className="auth-password-rules">{checks.map((item) => <li key={item.label} className={item.valid ? 'is-valid' : ''}><Check size={13} aria-hidden="true" />{item.label}</li>)}</ul>
        </div>
        <div className="auth-field">
          <label htmlFor="register-confirm">Нууц үгээ баталгаажуулах</label>
          <div className="auth-input-wrap"><KeyRound size={17} aria-hidden="true" /><input id="register-confirm" type={showConfirmation ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Нууц үгээ дахин оруулна уу" autoComplete="new-password" required /><button className="auth-visibility" type="button" onClick={() => setShowConfirmation((shown) => !shown)} aria-label={showConfirmation ? 'Нууц үг нуух' : 'Нууц үг харах'}>{showConfirmation ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        </div>
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><span className="auth-spinner" /> Бүртгэл үүсгэж байна…</> : <>Үнэгүй бүртгүүлэх <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">Бүртгэлтэй юу? <Link to="/login">Нэвтрэх</Link></p>
    </AuthLayout>
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  );
};

export default Register;
