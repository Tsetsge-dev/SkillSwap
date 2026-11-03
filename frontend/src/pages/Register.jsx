import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ surname: '', givenName: '', email: '', password: '', confirmPassword: '' });
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
      await register({ full_name: `${form.surname.trim()} ${form.givenName.trim()}`, email: form.email, password: form.password });
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === 'string' ? msg : 'Бүртгэл амжилтгүй боллоо. Имэйл бүртгэлтэй байж магадгүй.');
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
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
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
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="6+ тэмдэгт" required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Нууц үг давтах</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-500 focus:border-[#5277aa] focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
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

