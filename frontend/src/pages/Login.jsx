import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { getAuthErrorMessage, validateEmail } from '../services/authValidation';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      setLoading(false);
    }
  };

  return (
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
  );
};

export default Login;
