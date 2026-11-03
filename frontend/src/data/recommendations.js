export const assessmentQuestions = [
  {
    id: "interests",
    title: "Юу хийхэд танд хамгийн сонирхолтой санагддаг вэ?",
    helper: "Ойрхон санагдсан 2-4 сонголтыг сонгоорой.",
    type: "multi",
    min: 2,
    options: [
      { value: "technology", label: "Технологи, апп, төхөөрөмж" },
      { value: "creative", label: "Зураг, дизайн, бичлэг, хөгжим" },
      { value: "communication", label: "Ярих, тайлбарлах, хүмүүстэй ажиллах" },
      { value: "science", label: "Туршилт, тооцоо, судалгаа" },
      { value: "business", label: "Санаа гаргах, худалдаа, төсөл" },
      { value: "movement", label: "Спорт, хөдөлгөөн, багийн тоглолт" },
    ],
  },
  {
    id: "strengths",
    title: "Таны одоо сайн хийж чаддаг зүйлс юу вэ?",
    helper: "Өөрийгөө төгс гэж бодох албагүй. Давуу тал байж болох зүйлээ сонгоно уу.",
    type: "multi",
    min: 2,
    options: [
      { value: "logic", label: "Асуудлыг задалж бодох" },
      { value: "visual", label: "Юмыг гоё, цэгцтэй харагдуулах" },
      { value: "writing", label: "Бичих, санаагаа ойлгомжтой илэрхийлэх" },
      { value: "teamwork", label: "Багаар ажиллах, бусдыг дэмжих" },
      { value: "discipline", label: "Тууштай давтах, бэлтгэл хийх" },
      { value: "curiosity", label: "Шинэ зүйл турших, асуулт асуух" },
    ],
  },
  {
    id: "experience",
    title: "Та ямар түвшнээс эхэлж байна вэ?",
    helper: "Энэ нь онош биш, зөвхөн эхлэх алхмыг зөв тохируулахад ашиглагдана.",
    type: "single",
    options: [
      { value: "starter", label: "Шинээр эхэлж байгаа" },
      { value: "tried", label: "Өмнө нь бага зэрэг туршиж үзсэн" },
      { value: "builder", label: "Жижиг төсөл/дасгал хийж байсан" },
      { value: "confident", label: "Бусдад тайлбарлаж чадах түвшинд" },
    ],
  },
  {
    id: "learningStyle",
    title: "Та яаж сурахдаа илүү урамтай байдаг вэ?",
    helper: "Нэг гол хэв маягаа сонгоорой.",
    type: "single",
    options: [
      { value: "project", label: "Жижиг төсөл хийж турших" },
      { value: "mentor", label: "Хүнээр тайлбарлуулж, асууж сурах" },
      { value: "reading", label: "Заавар, нийтлэл, тэмдэглэл унших" },
      { value: "practice", label: "Давталт, дасгал, сорилтоор сайжрах" },
    ],
  },
  {
    id: "goal",
    title: "Ойрын 3 сард ямар үр дүн хүсэж байна вэ?",
    helper: "Танд одоо хамгийн хэрэгтэй зорилгыг сонгоно уу.",
    type: "single",
    options: [
      { value: "career", label: "Ирээдүйн мэргэжлийн чиглэлээ тодруулах" },
      { value: "portfolio", label: "Портфолио эсвэл бодит бүтээлтэй болох" },
      { value: "confidence", label: "Өөртөө итгэлтэй болж, хүмүүстэй харилцах" },
      { value: "health", label: "Эрүүл дадал, хөдөлгөөнөө тогтмолжуулах" },
    ],
  },
  {
    id: "collaboration",
    title: "Бусадтай хамтрахад танд аль нь тохиромжтой вэ?",
    helper: "SkillSwap дээр тохирох суралцах хэлбэр санал болгоход хэрэглэнэ.",
    type: "single",
    options: [
      { value: "solo", label: "Эхлээд ганцаараа туршаад дараа нь асуумаар байна" },
      { value: "buddy", label: "Нэг түвшний найзтай хамт ахимаар байна" },
      { value: "mentor", label: "Илүү туршлагатай хүнээс чиглэл авмаар байна" },
      { value: "team", label: "Багийн төсөл, клуб, тэмцээнд оролцмоор байна" },
    ],
  },
];

export const skillCatalog = [
  {
    id: "programming",
    name: "Программчлал",
    category: "Технологи",
    level: "Анхан шатнаас эхлэх боломжтой",
    tags: ["Python", "JavaScript", "Веб апп", "Алгоритм"],
    signals: ["technology", "logic", "curiosity", "project", "career", "portfolio", "solo", "mentor"],
    nextSteps: ["Python-ийн үндэс", "Жижиг тооцоолуур эсвэл quiz апп", "GitHub дээр бүтээлээ хадгалах"],
    explanation: "Логик сэтгэлгээ, технологийн сонирхол, асуудлыг алхамчилж шийдэх хандлагатай сайн нийцдэг.",
  },
  {
    id: "uiux",
    name: "UI/UX дизайн",
    category: "Дизайн",
    level: "Санаа, ажиглалтаас эхэлнэ",
    tags: ["Figma", "Прототип", "Хэрэглэгчийн судалгаа", "Визуал систем"],
    signals: ["creative", "visual", "communication", "project", "portfolio", "career", "buddy", "team"],
    nextSteps: ["Figma дээр 3 дэлгэцийн прототип", "Найзаасаа хэрэглээний санал авах", "Өнгө, spacing-ийн жижиг систем гаргах"],
    explanation: "Юмыг ойлгомжтой, цэгцтэй болгох сонирхол болон хэрэглэгчийн хэрэгцээг ажиглах чадвартай тохирно.",
  },
  {
    id: "content",
    name: "Контент бүтээлт",
    category: "Бүтээлч",
    level: "Гар утаснаас эхэлж болно",
    tags: ["Бичлэг", "Storytelling", "Монтаж", "Сошиал санаа"],
    signals: ["creative", "writing", "communication", "curiosity", "project", "portfolio", "confidence", "team"],
    nextSteps: ["30 секундын тайлбар бичлэг", "Долоо хоногийн контент төлөвлөгөө", "Нэг сэдвээр 3 өөр формат турших"],
    explanation: "Санаагаа богино, ойлгомжтой, сонирхолтой хэлбэрээр хүргэх хүсэлтэй хэрэглэгчдэд сайн тохирдог.",
  },
  {
    id: "public-speaking",
    name: "Илтгэх ба харилцаа",
    category: "Харилцаа",
    level: "Өдөр тутмын дасгалаар ахина",
    tags: ["Илтгэл", "Дебат", "Ярилцлага", "Багийн манлайлал"],
    signals: ["communication", "teamwork", "writing", "mentor", "practice", "confidence", "team", "buddy"],
    nextSteps: ["1 минутын богино илтгэл бичих", "Дуу хоолойгоо бичиж сонсох", "Найзтайгаа асуулт-хариулт хийх"],
    explanation: "Хүмүүстэй ажиллах, санаагаа тодорхой илэрхийлэх, өөртөө итгэл нэмэх зорилготой хүчтэй нийцнэ.",
  },
  {
    id: "data-science",
    name: "Дата шинжилгээ",
    category: "Шинжлэх ухаан",
    level: "Суурь математикаас эхэлнэ",
    tags: ["Excel", "Python", "График", "Судалгаа"],
    signals: ["science", "technology", "logic", "curiosity", "reading", "project", "career", "solo"],
    nextSteps: ["Жижиг хүснэгт цэвэрлэх", "Графикаар дүгнэлт гаргах", "Python pandas-ийн үндэс үзэх"],
    explanation: "Тоон мэдээллээс утга олох, нотолгоонд тулгуурлаж шийдвэр гаргах сонирхолтой хэрэглэгчдэд тохиромжтой.",
  },
  {
    id: "entrepreneurship",
    name: "Бизнес санаа ба төсөл",
    category: "Бизнес",
    level: "Асуудал ажиглахаас эхэлнэ",
    tags: ["Lean canvas", "Судалгаа", "Маркетинг", "Pitch"],
    signals: ["business", "communication", "teamwork", "curiosity", "project", "career", "team", "mentor"],
    nextSteps: ["Сургуулийн орчны нэг асуудал сонгох", "5 хүнээс богино ярилцлага авах", "1 хуудас санааны зураглал гаргах"],
    explanation: "Санаачилгатай, хүмүүстэй ярилцаж хэрэгцээ ойлгох, жижиг төсөл эхлүүлэх хүсэлтэй үед сайн тохирно.",
  },
  {
    id: "language",
    name: "Гадаад хэлний практик",
    category: "Хэл",
    level: "Өдөр бүрийн жижиг дадлаар ахина",
    tags: ["Яриа", "Сонсгол", "Үгсийн сан", "Солилцоо"],
    signals: ["communication", "writing", "discipline", "mentor", "practice", "confidence", "buddy"],
    nextSteps: ["Өдөрт 10 шинэ үг", "7 хоногт 2 удаа ярианы buddy", "Сонирхдог сэдвээр богино тэмдэглэл бичих"],
    explanation: "Тогтмол давтах, хүнтэй ярилцаж сурах, өөрийгөө илэрхийлэх зорилготой хэрэглэгчдэд тохирно.",
  },
  {
    id: "sports-coaching",
    name: "Спорт ба дасгалжуулалт",
    category: "Хөдөлгөөн",
    level: "Аюулгүй суурь дадлаас эхэлнэ",
    tags: ["Багийн ажил", "Дадал", "Тэсвэр", "Зорилго"],
    signals: ["movement", "discipline", "teamwork", "practice", "health", "team", "buddy"],
    nextSteps: ["7 хоногийн бодит хуваарь", "Суурь техникээ зөв сурах", "Ахицын тэмдэглэл хөтлөх"],
    explanation: "Хөдөлгөөнөөр сурах, тууштай дадал бий болгох, багийн орчинд өсөх хүсэлтэй хэрэглэгчдэд нийцнэ.",
  },
];

export function scoreRecommendations(answers) {
  const selectedSignals = Object.values(answers).flat().filter(Boolean);
  const totalSignals = Math.max(selectedSignals.length, 1);

  return skillCatalog
    .map((skill) => {
      const matchedSignals = skill.signals.filter((signal) => selectedSignals.includes(signal));
      const baseScore = matchedSignals.length / Math.max(skill.signals.length, 1);
      const coverageBonus = matchedSignals.length / totalSignals;
      const score = Math.round(Math.min(98, 48 + baseScore * 38 + coverageBonus * 18));

      return {
        ...skill,
        score,
        matchedSignals,
        reasons: buildReasons(skill, answers, matchedSignals),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function buildReasons(skill, answers, matchedSignals) {
  const reasons = [];

  if (answers.interests?.some((value) => skill.signals.includes(value))) {
    reasons.push("Таны сонгосон сонирхлын чиглэлтэй давхцаж байна.");
  }
  if (answers.strengths?.some((value) => skill.signals.includes(value))) {
    reasons.push("Одоогийн давуу талууд тань энэ чиглэлд хэрэг болох суурь өгч байна.");
  }
  if (skill.signals.includes(answers.learningStyle)) {
    reasons.push("Таны сурах хэв маяг энэ чиглэлийн эхлэх аргатай нийцэж байна.");
  }
  if (skill.signals.includes(answers.goal)) {
    reasons.push("Ойрын зорилгод тань хэрэг болох бодит үр дүн гаргах боломжтой.");
  }
  if (skill.signals.includes(answers.collaboration)) {
    reasons.push("Таны хүссэн хамтрах хэлбэрээр SkillSwap дээр туршихад тохиромжтой.");
  }

  if (reasons.length === 0 && matchedSignals.length > 0) {
    reasons.push("Таны зарим сонголт энэ чиглэлийн суурь чадвартай огтлолцож байна.");
  }

  return reasons.slice(0, 4);
}
