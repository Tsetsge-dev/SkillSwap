import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ surname: '', givenName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    { label: '8-аас доошгүй тэмдэгт', valid: form.password.length >= 8 },
    { label: 'Том, жижиг үсэг хослуулах', valid: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password) },
    { label: 'Дор хаяж нэг тоо оруулах', valid: /\d/.test(form.password) },
  ];
  const passwordStrength = passwordRules.filter((rule) => rule.valid).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(nextForm.confirmPassword && nextForm.password !== nextForm.confirmPassword
        ? 'Нууц үг таарахгүй байна.'
        : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setPasswordError('Нууц үг таарахгүй байна.');
      return;
    }
    if (passwordStrength < passwordRules.length) {
      setError('Нууц үгийн бүх шаардлагыг хангана уу.');
      return;
    }
    setLoading(true);
    try {
      const registeredUser = await register({ full_name: `${form.surname.trim()} ${form.givenName.trim()}`, email: form.email, password: form.password });
      if (!registeredUser?.id || !localStorage.getItem('skillswap_token')) {
        throw new Error('Бүртгэл үүссэн ч нэвтрэх төлөв хадгалагдсангүй. Дахин нэвтэрнэ үү.');
      }
      navigate('/profile', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === 'string' ? msg : (err.message || 'Бүртгэл амжилтгүй боллоо. Имэйл бүртгэлтэй байж магадгүй.'));
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

        <div className="text-left">
          <BrandLogo className="mb-5 h-12 w-auto max-w-[190px]" />
          <h1 className="text-3xl font-extrabold text-slate-800">Шинэ бүртгэл үүсгэх</h1>
          <p className="mt-2 text-sm text-slate-600">Мэддэг зүйлээ бусдад зааж, сурахыг хүссэн зүйлээ хамтдаа эзэмшээрэй.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel space-y-5 rounded-[28px] p-6 sm:p-10">
          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="register-surname" className="text-sm font-semibold text-slate-700">Овог</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input id="register-surname" type="text" name="surname" value={form.surname} onChange={handleChange} placeholder="Овгоо оруулна уу" autoComplete="family-name" maxLength={50} required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="register-given-name" className="text-sm font-semibold text-slate-700">Нэр</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input id="register-given-name" type="text" name="givenName" value={form.givenName} onChange={handleChange} placeholder="Нэрээ оруулна уу" autoComplete="given-name" maxLength={50} required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Имэйл хаяг</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="имэйл@example.com" required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Нууц үг</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Шинэ нууц үг" autoComplete="new-password" minLength={8} required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Нууц үг нуух' : 'Нууц үг харах'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#456488] hover:bg-[#edf3fa]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-3 space-y-2 rounded-2xl border border-[#d8e3f0] bg-white/70 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#29466f]">Нууц үгийн хүч</span>
                <span className={`text-xs font-bold ${passwordStrength === 3 ? 'text-emerald-700' : passwordStrength === 0 ? 'text-[#526b8d]' : 'text-amber-700'}`}>
                  {passwordStrength === 3 ? 'Сайн' : passwordStrength === 0 ? 'Нууц үг үүсгээрэй' : 'Үргэлжлүүлнэ үү'}
                </span>
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((bar) => <span key={bar} className={`h-1.5 flex-1 rounded-full ${bar < passwordStrength ? (passwordStrength === 3 ? 'bg-emerald-600' : 'bg-amber-500') : 'bg-slate-200'}`} />)}
              </div>
              <ul className="grid gap-1 sm:grid-cols-2">
                {passwordRules.map((rule) => <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.valid ? 'font-semibold text-emerald-800' : 'text-[#526b8d]'}`}><CheckCircle2 className={`h-3.5 w-3.5 ${rule.valid ? 'text-emerald-700' : 'text-[#8297b3]'}`} />{rule.label}</li>)}
              </ul>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Нууц үг давтах</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Нууц үгээ дахин оруулна уу" autoComplete="new-password" aria-invalid={!!passwordError} required
                className={`w-full rounded-full border bg-white py-3 pl-11 pr-12 text-sm text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 ${passwordError ? 'border-red-500 focus:border-red-600 focus:ring-red-100' : 'border-slate-200 focus:border-[#5277aa] focus:ring-blue-100'}`} />
              <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Нууц үг нуух' : 'Нууц үг харах'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#456488] hover:bg-[#edf3fa]">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && <p role="alert" className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{passwordError}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-[#5277aa] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#365984] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
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
  );
};

export default Register;

