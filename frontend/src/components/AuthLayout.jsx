import React from 'react';
import { ArrowRightLeft, BookOpenCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, mode }) => (
  <section className="auth-page">
    <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
    <div className="auth-ambient auth-ambient-two" aria-hidden="true" />
    <div className="auth-layout">
      <aside className="auth-story">
        <Link to="/" className="auth-brand" aria-label="SkillSwap нүүр хуудас">
          <span className="auth-brand-mark"><ArrowRightLeft size={20} strokeWidth={2.5} /></span>
          <span>Skill<span>Swap</span></span>
        </Link>
        <div className="auth-story-copy">
          <span className="auth-eyebrow"><Sparkles size={14} /> ЧАДВАРАА ХУВААЛЦ</span>
          <h2>Хамтдаа сурч,<br /><span>хамтдаа өсөцгөөе.</span></h2>
          <p>Мэддэг зүйлээ бусдад зааж, өөрөө шинэ чадвар сураарай. Суралцах дараагийн алхмаа эндээс эхлүүлээрэй.</p>
        </div>
        <div className="auth-story-note">
          <div className="auth-note-icon"><BookOpenCheck size={19} /></div>
          <div><strong>Харилцан суралцах орчин</strong><span>Хүн бүр бусдад зааж, өөрөө сурах боломжтой.</span></div>
        </div>
        <div className="auth-trust"><ShieldCheck size={15} /> Таны мэдээллийг хамгаална</div>
      </aside>
      <main className={`auth-card auth-card-${mode}`}>
        {children}
        <p className="auth-card-foot">SkillSwap-д нэгдэж, мэдлэг чадвараа бусадтай хуваалцаарай.</p>
      </main>
    </div>
    <footer className="auth-footer">© {new Date().getFullYear()} SkillSwap · Ур чадвараа хуваалцъя</footer>
  </section>
);

export default AuthLayout;
