import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, mode }) => (
  <section className="auth-page">
    <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
    <div className="auth-ambient auth-ambient-two" aria-hidden="true" />
    <div className="auth-layout">
      <main className={`auth-card auth-card-${mode}`}>
        <Link to="/" className="auth-brand auth-brand-card" aria-label="SkillSwap нүүр хуудас">
          <span className="auth-brand-mark"><ArrowRightLeft size={18} strokeWidth={2.5} /></span>
          <span>Skill<span>Swap</span></span>
        </Link>
        {children}
        <p className="auth-card-foot">SkillSwap-д нэгдэж, мэдлэг чадвараа бусадтай хуваалцаарай.</p>
      </main>
    </div>
    <footer className="auth-footer">© {new Date().getFullYear()} SkillSwap · Ур чадвараа хуваалцъя</footer>
  </section>
);

export default AuthLayout;
