import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const AuthLayout = ({ children, mode }) => (
  <section className="auth-page">
    <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
    <div className="auth-ambient auth-ambient-two" aria-hidden="true" />
    <div className="auth-layout">
      <main className={`auth-card auth-card-${mode}`}>
        <Link to="/" className="auth-brand auth-brand-card" aria-label="SkillSwap нүүр хуудас">
          <BrandLogo className="h-14 w-auto max-w-[210px] rounded-lg bg-white p-1" />
        </Link>
        {children}
        <p className="auth-card-foot">SkillSwap-д нэгдэж, мэдлэг чадвараа бусадтай хуваалцаарай.</p>
      </main>
    </div>
    <footer className="auth-footer">© {new Date().getFullYear()} SkillSwap · Ур чадвараа хуваалцъя</footer>
  </section>
);

export default AuthLayout;
