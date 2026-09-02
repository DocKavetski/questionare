/** Interview modules unlocked by domains / refinements / nested answers */

export const MODULES = [
  {
    id: "frame",
    title: "Жалоба и рамка",
    always: true,
    items: [
      { kind: "text", id: "complaint", label: "Жалоба словами пациента", area: true },
      { kind: "text", id: "dur_mo", label: "Длительность, мес.", mini: true },
      { kind: "chips", prefix: "ctx", label: "Контекст", opts: ["с партнёром", "мастурбация", "везде", "стресс / усталость", "алкоголь", "презерватив"] },
      { kind: "text", id: "goal", label: "Цель визита", area: true, placeholder: "что будет «достаточно хорошо»" },
    ],
  },
  {
    id: "desire",
    title: "Желание",
    domains: ["desire"],
    items: [
      { kind: "text", id: "mot", label: "Мотивация к изменению 0–10", mini: true },
      { kind: "text", id: "conf", label: "Уверенность 0–10", mini: true },
      { kind: "chips", prefix: "abst_feel", label: "Переносимость абстиненции", opts: ["облегчение", "не сказывается", "дискомфорт, фиксация", "не выдерживает"] },
      { kind: "text", id: "desire_note", label: "Уточнение", area: true },
    ],
  },
  {
    id: "erection",
    title: "Эрекция",
    domains: ["erection"],
    sex: "m",
    items: [
      { kind: "chips", prefix: "erect_coitus", label: "При коитусе", opts: ["быстрые", "средние", "медленные", "полные", "неполные", "ослабленные", "нет"] },
      { kind: "chips", prefix: "erect_gone", label: "Ослабевают / исчезают", opts: ["обнажение", "презерватив", "попытка пенетрации", "первые фрикции", "в процессе", "непривычная обстановка"] },
      { kind: "chips", prefix: "erect_sp", label: "Спонтанные / утренние", opts: ["полные", "неполные", "ослабленные", "нет"] },
      { kind: "chips", prefix: "erect_mast", label: "Мастурбация", opts: ["полные", "неполные", "ослабленные", "нет"] },
    ],
  },
  {
    id: "anxiety_expect",
    title: "Тревога ожидания",
    domains: ["erection"],
    refinements: ["situational", "partner_only"],
    items: [
      { kind: "chips", prefix: "anx_ed", label: "Паттерн", opts: ["наблюдатель", "катастрофизация", "стыд", "страх отказа", "избегание инициативы"] },
      { kind: "text", id: "anx_note", label: "Как проявляется в сексе", area: true },
    ],
  },
  {
    id: "ejaculation",
    title: "Эякуляция",
    domains: ["ejaculation"],
    sex: "m",
    items: [
      { kind: "chips", prefix: "ejac_when", label: "Когда", opts: ["до пенетрации", "в момент пенетрации", "после начала фрикций", "отсутствует"] },
      { kind: "text", id: "ejac_sec", label: "Через (сек / мин / фрикции)" },
      { kind: "chips", prefix: "prolong", label: "Контроль", opts: ["утрачен", "частичный", "не актуален"] },
    ],
  },
  {
    id: "arousal_f",
    title: "Возбуждение и смазка",
    domains: ["arousal"],
    sex: "f",
    items: [
      { kind: "chips", prefix: "lub_fore", label: "При ласках", opts: ["высокая", "умеренная", "низкая", "нет"] },
      { kind: "chips", prefix: "lub_coitus", label: "При коитусе", opts: ["усиливается", "снижается", "исчезает", "нет"] },
      { kind: "chips", prefix: "pen_f", label: "Пенетрация", opts: ["свободно", "затруднена", "не удаётся"] },
    ],
  },
  {
    id: "pain",
    title: "Боль и дискомфорт",
    domains: ["pain"],
    items: [
      { kind: "chips", prefix: "pain_where", label: "Где", opts: ["вход", "глубоко", "после", "постоянно"] },
      { kind: "chips", prefix: "pen_why", label: "Из‑за", opts: ["боль", "недостаточное расслабление", "спазм"], sex: "f" },
      { kind: "text", id: "pain_note", label: "Описание", area: true },
    ],
  },
  {
    id: "orgasm",
    title: "Оргазм",
    domains: ["orgasm"],
    items: [
      { kind: "text", id: "org_pct", label: "% оргастичности", mini: true },
      { kind: "text", id: "sat", label: "Удовлетворение 0–10", mini: true },
      { kind: "text", id: "org_note", label: "Уточнение", area: true },
    ],
  },
  {
    id: "meds",
    title: "Лекарства и соматика",
    domains: ["iatrogenic", "desire", "erection", "arousal"],
    items: [
      { kind: "text", id: "meds", label: "Препараты, доза, с какого времени", area: true },
      { kind: "chips", prefix: "chr", label: "Хронические", opts: ["диабет", "гипертония", "щитовидная", "депрессия", "тревога", "неврология", "ССС"] },
      { kind: "text", id: "substances", label: "Алкоголь / ПАВ", area: true },
    ],
  },
  {
    id: "partner",
    title: "Пара и условия",
    domains: ["partner", "erection", "desire", "arousal", "pain"],
    items: [
      { kind: "chips", prefix: "has_p", label: "Статус", opts: ["нет партнёра", "встречается", "незарег. брак", "брак"] },
      { kind: "chips", prefix: "p_prob", label: "Отношение к проблеме", opts: ["с пониманием", "безразлично", "недовольство", "угрозы"] },
      { kind: "chips", prefix: "cond_bad", label: "Помехи", opts: ["нет изоляции", "дети / родственники", "нет звукоизоляции", "раздельная постель", "неудобное время"] },
      { kind: "text", id: "partner_note", label: "Контекст пары", area: true },
    ],
  },
  {
    id: "dual",
    title: "Dual Control",
    domains: ["erection", "ejaculation", "arousal", "desire"],
    items: [
      { kind: "scale", id: "dcm_ses", label: "SES — возбуждение / драйв", max: 4 },
      { kind: "scale", id: "dcm_sis1", label: "SIS1 — торможение неудачи", max: 4 },
      { kind: "scale", id: "dcm_sis2", label: "SIS2 — торможение последствий", max: 4 },
    ],
  },
  {
    id: "risk",
    title: "Риск",
    domains: ["iatrogenic", "desire", "pain"],
    items: [
      { kind: "chips", prefix: "sui", label: "Суицидальный риск", opts: ["мыслей нет", "мысли", "замысел", "намерение"] },
      { kind: "text", id: "sui_note", label: "Если есть — подробно", area: true },
      { kind: "text", id: "trauma", label: "Травматический опыт", area: true },
    ],
  },
];

export function activeModules(sex, domains, refinements) {
  const sexKey = sex === "f" ? "f" : "m";
  const dSet = new Set(domains);
  const rSet = new Set(refinements);
  return MODULES.filter((m) => {
    if (m.sex && m.sex !== sexKey) return false;
    if (m.always) return true;
    if (!dSet.size) return false;
    if (m.refinements?.length) {
      const domainOk = !m.domains || m.domains.some((d) => dSet.has(d));
      return domainOk && m.refinements.some((r) => rSet.has(r));
    }
    return m.domains?.some((d) => dSet.has(d));
  });
}
