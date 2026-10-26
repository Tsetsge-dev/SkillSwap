import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import SkillBadge from './SkillBadge';

const SurveyProfileCard = ({ profile }) => {
  const initials = profile.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('');

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-sm font-black text-indigo-800">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-800">{profile.full_name}</h3>
          <p className="mt-0.5 text-[10px] font-medium text-indigo-600">Судалгааны жишээ · бүртгэл биш</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-violet-700"><GraduationCap className="h-3.5 w-3.5" /> Зааж болох чадвар</div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills_offered.filter((skill) => skill.skill_name !== 'Байхгүй').map((skill) => <SkillBadge key={skill.skill_name} name={skill.skill_name} proficiency={skill.proficiency_level} size="sm" />)}
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-sky-700"><BookOpen className="h-3.5 w-3.5" /> Сурахыг хүссэн чадвар</div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills_wanted.map((skill) => <SkillBadge key={skill.skill_name} name={skill.skill_name} proficiency={skill.target_level} type="wanted" size="sm" />)}
          </div>
        </div>
      </div>
    </article>
  );
};

export default SurveyProfileCard;
