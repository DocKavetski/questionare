import { IV_CTX, CHR, SUI, hasPartnerOpts } from "./fields.js";

/** Симптомы — точка входа адаптивного интервью. Хранятся как checks sym:<id> */

export const SYMPTOMS = {
  m: [
    { id: "low_desire", label: "↓ либидо / желание", visit: "желание" },
    { id: "ed", label: "↓ эрекция", visit: "ЭД" },
    { id: "pe", label: "ПЭ", visit: "ПЭ" },
    { id: "delayed_ejac", label: "задержка / нет эякуляции", visit: "оргазм" },
    { id: "orgasm", label: "↓ оргазм / ангедония", visit: "оргазм" },
    { id: "pain", label: "боль", visit: "боль" },
    { id: "partner", label: "проблема пары", visit: "пара" },
    { id: "after_meds", label: "после АД / препаратов", visit: "после АД" },
  ],
  f: [
    { id: "low_desire", label: "↓ желание", visit: "желание" },
    { id: "arousal", label: "↓ возбуждение / смазка", visit: "любрикация" },
    { id: "orgasm", label: "↓ / нет оргазма", visit: "оргазм" },
    { id: "pain", label: "боль / спазм", visit: "боль" },
    { id: "vaginismus", label: "вагинизм / нет пенетрации", visit: "спазм" },
    { id: "partner", label: "проблема пары", visit: "пара" },
    { id: "after_meds", label: "после АД / препаратов", visit: "после АД" },
    { id: "coc", label: "на фоне КОК", visit: "КОК" },
  ],
};

/** Модули вопросов — показываются при always или если активен хотя бы один симптом из списка */
export const MODULES = [
  {
    id: "frame",
    title: "Жалоба и рамка",
    always: true,
    items: [
      { kind: "text", id: "complaint", label: "Жалоба (слова пациента)", area: true },
      { kind: "text", id: "dur_mo", label: "Длительность, мес.", mini: true },
      { kind: "chips", prefix: "iv_ctx", label: "Контекст", opts: IV_CTX },
      { kind: "text", id: "goal", label: "Цель визита / «достаточно хорошо»", area: true },
    ],
  },
  {
    id: "desire",
    title: "Либидо и мотивация",
    symptoms: ["low_desire"],
    items: [
      { kind: "text", id: "mot", label: "Мотивация к изменению 0–10", mini: true },
      { kind: "text", id: "conf", label: "Уверенность 0–10", mini: true },
      { kind: "text", id: "desire_n", label: "Желание коитуса (частота)", sex: "m" },
      { kind: "text", id: "init_now", label: "Инициатива сейчас, %", sex: "f", mini: true },
      { kind: "chips", prefix: "abst_feel", label: "Переносимость абстиненции", opts: ["облегчение и подъём настроения", "на настроении не сказывается", "умеренный дискомфорт, фиксация мыслей", "не выдерживает, прибегает к мастурбации"] },
    ],
  },
  {
    id: "erection",
    title: "Эрекция",
    sex: "m",
    symptoms: ["ed"],
    items: [
      { kind: "chips", prefix: "erect_coitus", label: "При коитусе", opts: ["быстрой возбудимости", "средней", "медленной", "полные", "неполные", "неполные ослабленные", "отсутствуют"] },
      { kind: "chips", prefix: "erect_gone", label: "Ослабевают / исчезают", opts: ["при обнажении", "при надевании презерватива", "при попытке совершить пенетрацию", "во время первых фрикций", "в процессе фрикций", "в непривычной обстановке"] },
      { kind: "chips", prefix: "erect_sp", label: "Спонтанные", opts: ["резко повышенные", "повышенные", "полные", "неполные", "ослабленные", "отсутствуют"] },
      { kind: "chips", prefix: "erect_mast", label: "При мастурбации", opts: ["быстрой возбудимости", "средней", "медленной", "полные", "неполные", "ослабленные", "отсутствуют"] },
    ],
  },
  {
    id: "ejaculation",
    title: "Эякуляция",
    sex: "m",
    symptoms: ["pe", "delayed_ejac"],
    items: [
      { kind: "chips", prefix: "ejac_when", label: "Когда", opts: ["до пенетрации", "в момент пенетрации", "после начала фрикций", "отсутствует", "оргазм без эякуляции"] },
      { kind: "text", id: "ejac_sec", label: "Через (сек / мин / фрикции)" },
      { kind: "chips", prefix: "prolong", label: "Пролонгация", opts: ["банальная", "истинная", "контроль не актуален"] },
    ],
  },
  {
    id: "arousal_f",
    title: "Возбуждение и любрикация",
    sex: "f",
    symptoms: ["arousal"],
    items: [
      { kind: "chips", prefix: "lub_fore", label: "Любрикация (ласки)", opts: ["высокая", "умеренная", "низкая", "отсутствует"] },
      { kind: "chips", prefix: "lub_coitus", label: "Во время коитуса", opts: ["усиливается", "снижается", "исчезает", "отсутствует"] },
      { kind: "chips", prefix: "pen_f", label: "Пенетрация", opts: ["удаётся свободно", "затруднена", "не удаётся"] },
    ],
  },
  {
    id: "pain_block",
    title: "Боль и дискомфорт",
    symptoms: ["pain", "vaginismus"],
    items: [
      { kind: "chips", prefix: "pen_why", label: "Из-за (ж)", opts: ["боль", "недостаточное расслабление", "судорожный спазм мышц"], sex: "f" },
      { kind: "chips", prefix: "fric_feel", label: "Ощущения при фрикциях", opts: ["запредельные (экстатические)", "сильные, яркие", "приятные", "слабоприятные", "нейтральные", "неприятные", "болезненные"] },
    ],
  },
  {
    id: "orgasm",
    title: "Оргазм",
    symptoms: ["orgasm", "delayed_ejac"],
    items: [
      { kind: "text", id: "org_pct", label: "% оргастичности", mini: true },
      { kind: "text", id: "sat", label: "Удовлетворение 0–10", mini: true },
    ],
  },
  {
    id: "meds",
    title: "Лекарства и соматика",
    symptoms: ["after_meds", "low_desire", "ed", "arousal"],
    items: [
      { kind: "text", id: "meds", label: "Лекарства (препарат, доза, с когда)", area: true },
      { kind: "chips", prefix: "chr", label: "Хронические", optsFn: "chr" },
      { kind: "text", id: "substances", label: "Алкоголь / ПАВ", area: true },
    ],
  },
  {
    id: "partner",
    title: "Пара и условия",
    symptoms: ["partner", "ed", "low_desire", "arousal", "pain"],
    items: [
      { kind: "chips", prefix: "has_p", label: "Партнёр", optsFn: "has_p" },
      { kind: "chips", prefix: "p_prob", label: "Отношение к проблеме", opts: ["с пониманием", "безразлично", "недовольство", "угрожает изменой", "угрожает разводом"] },
      { kind: "chips", prefix: "cond_bad", label: "Помехи", opts: ["нет изолированной комнаты", "спят родственники/дети", "может войти посторонний", "нет звукоизоляции", "раздельная постель", "разные комнаты", "неудобное время"] },
    ],
  },
  {
    id: "control",
    title: "Dual Control (клинически)",
    symptoms: ["ed", "pe", "arousal", "low_desire"],
    items: [
      { kind: "scale", id: "dcm_ses", label: "SES — возбуждение / драйв", hint: "1 низко … 4 высоко" },
      { kind: "scale", id: "dcm_sis1", label: "SIS1 — торможение неудачи", hint: "1 низко … 4 высоко" },
      { kind: "scale", id: "dcm_sis2", label: "SIS2 — торможение последствий", hint: "1 низко … 4 высоко" },
    ],
  },
  {
    id: "risk",
    title: "Риск и травма",
    symptoms: ["after_meds", "low_desire", "pain", "vaginismus"],
    items: [
      { kind: "chips", prefix: "sui", label: "Суицидальный риск", opts: SUI },
      { kind: "text", id: "sui_note", label: "Если есть — подробно", area: true },
      { kind: "text", id: "trauma", label: "Непереработанный опыт", area: true },
    ],
  },
  {
    id: "close",
    title: "Формулировка и план",
    always: true,
    items: [
      { kind: "text", id: "predx", label: "Предварительная формулировка", area: true },
      { kind: "text", id: "plan_sex", label: "План (секстерапия / пара / фарма)", area: true },
      { kind: "text", id: "plan_pt", label: "Психотерапия", area: true },
    ],
  },
];

/** Опросники — показываются при активных симптомах */
export const SCALES = [
  { id: "iief5", title: "IIEF-5", sub: "Эрекция · 5 вопросов", symptoms: ["ed"], sex: "m" },
  { id: "pedt", title: "PEDT", sub: "ПЭ · 5 вопросов", symptoms: ["pe"], sex: "m" },
  { id: "fsfi", title: "FSFI (кратко)", sub: "Желание, смазка, оргазм, боль", symptoms: ["low_desire", "arousal", "orgasm", "pain"], sex: "f" },
  { id: "dcm", title: "Dual Control", sub: "Уже в блоке выше или полный темперамент", symptoms: ["ed", "pe"], link: "temp" },
  { id: "comorbid", title: "Депрессия / тревога", sub: "Если ↓ либидо или после АД", symptoms: ["low_desire", "after_meds"], link: "comorbid" },
  { id: "opd", title: "OPD-3", sub: "Структура личности", symptoms: ["partner", "low_desire"], link: "opd" },
];

export function symptomList(state) {
  const female = state.patient.sex === "f";
  return female ? SYMPTOMS.f : SYMPTOMS.m;
}

export function activeSymptomIds(state) {
  return symptomList(state).filter((s) => state.checks["sym:" + s.id]).map((s) => s.id);
}

export function activeModules(state) {
  const female = state.patient.sex === "f";
  const sex = female ? "f" : "m";
  const active = new Set(activeSymptomIds(state));
  const hasSymptoms = active.size > 0;

  return MODULES.filter((m) => {
    if (m.sex && m.sex !== sex) return false;
    if (m.always) return true;
    if (!hasSymptoms) return m.id === "frame" || m.id === "close";
    if (!m.symptoms?.length) return false;
    return m.symptoms.some((s) => active.has(s));
  });
}

export function recommendedScales(state) {
  const female = state.patient.sex === "f";
  const sex = female ? "f" : "m";
  const active = new Set(activeSymptomIds(state));
  if (!active.size) return [];

  return SCALES.filter((s) => {
    if (s.sex && s.sex !== sex) return false;
    if (s.link === "temp" && active.has("ed")) return true;
    return s.symptoms.some((sym) => active.has(sym));
  });
}

export function moduleItems(state, module) {
  const female = state.patient.sex === "f";
  const sex = female ? "f" : "m";
  return module.items.filter((it) => !it.sex || it.sex === sex);
}

export function resolveOpts(item, state) {
  const female = state.patient.sex === "f";
  if (item.opts) return item.opts;
  if (item.optsFn === "chr") return CHR[female ? "f" : "m"];
  if (item.optsFn === "has_p") return hasPartnerOpts(female);
  return [];
}
