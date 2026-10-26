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
          <p>Өөрийн мэддэг зүйлээ зааж, шинээр сурах чадвараа олоорой. Чиний дараагийн боломж эндээс эхэлнэ.</p>
        </div>
        <div className="auth-story-note">
          <div className="auth-note-icon"><BookOpenCheck size={19} /></div>
          <div><strong>Харилцан суралцах орон зай</strong><span>Чадвар бүр үнэ цэнтэй.</span></div>
        </div>
        <div className="auth-trust"><ShieldCheck size={15} /> Таны мэдээллийг хамгаална</div>
      </aside>
      <main className={`auth-card auth-card-${mode}`}>
        {children}
        <p className="auth-card-foot">Үргэлжлүүлснээр SkillSwap-ийн олон нийтийн эерэг орчинд нэгдэнэ.</p>
      </main>
    </div>
    <footer className="auth-footer">© {new Date().getFullYear()} SkillSwap · Ур чадвараа хуваалцъя</footer>
  </section>
);

export default AuthLayout;
