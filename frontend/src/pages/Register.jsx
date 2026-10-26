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
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="register">
      <div className="auth-heading">
        <span className="auth-heading-icon"><UserRound size={21} /></span>
        <span className="auth-eyebrow">ӨӨРИЙН ЭРХЭМ ЗОРИЛГО</span>
        <h1>Шинэ бүртгэл үүсгэх</h1>
        <p>Өөрийн мэдлэг, сурах хүсэл хоёрыг нэг дор уулзуул.</p>
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
  );
};

export default Register;
