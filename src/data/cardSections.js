import { EZ_M, EZ_F } from "./clinical.js";

/** Section registry for the sexology card (blank 21.10.2024). */

export const CARD_SECTIONS = [
  {
    id: "pass",
    title: "Паспорт",
    desc: "Социальные данные, образование, обстоятельства обращения",
    tier: "base",
    probes: {
      patient: ["name", "cardNo"],
      fields: ["citizen", "job", "addr", "mot"],
      chips: ["come", "mar", "edu"],
    },
    tools: [],
  },
  {
    id: "problem",
    title: "Жалобы",
    desc: "Жалоба, исследование проблемы, цель, удовлетворённость",
    tier: "first",
    probes: {
      fields: ["complaint", "problem", "goal", "last_coitus"],
      chips: ["visit_prob"],
    },
    tools: [{ id: "interview", label: "Интервью с «?»" }],
  },
  {
    id: "function",
    title: "Функция",
    desc: "Влечение, эрекция/любрикация, оргазм, эякуляция",
    tier: "first",
    probes: {
      fields: ["org_pct", "ejac_sec", "coitus_n"],
      chips: {
        m: ["erect_coitus", "erect_gone", "ejac_when", "pen"],
        f: ["lub_fore", "lub_coitus", "pen_f", "org_norm"],
      },
    },
    tools: [{ id: "temp", label: "Темперамент" }],
  },
  {
    id: "history",
    title: "Анамнез",
    desc: "Пубертат, мастурбация, первый коитус, репродукция",
    tier: "full",
    probes: {
      fields: ["first_coitus", "menarche", "first_ejac", "mast_from"],
      chips: ["first_coitus_ok", "mast_type", "contr"],
    },
    tools: [],
  },
  {
    id: "soma",
    title: "Сома",
    desc: "Заболевания, лекарства, ПАВ, травма, суицидальный риск",
    tier: "first",
    probes: {
      fields: ["meds", "substances", "trauma", "sui_note"],
      chips: ["chr", "sui"],
    },
    tools: [
      { id: "comorbid", label: "Депрессия / тревога" },
      { id: "handouts", label: "Памятки АД" },
    ],
  },
  {
    id: "partner",
    title: "Пара",
    desc: "Отношения, условия коитуса, ласки, сценарий",
    tier: "full",
    probes: {
      fields: ["p_dur", "cond_ok"],
      chips: ["has_p", "p_prob", "pos", "feel"],
    },
    tools: [{ id: "handouts", label: "Раздатки для пары" }],
  },
  {
    id: "ez",
    title: "ЭЗ",
    desc: "Эрогенные зоны: пассивные и активные ласки",
    tier: "full",
    probes: { ez: true, chips: ["ez_type"], fields: ["ez_note"] },
    tools: [],
  },
  {
    id: "exam",
    title: "Осмотр",
    desc: "Антропометрия, патология, индексы конституции",
    tier: "full",
    probes: {
      fields: ["h", "w", "gu", "mse", "const_note"],
      chips: ["hair", "look"],
    },
    tools: [],
  },
  {
    id: "struct",
    title: "МКБ",
    desc: "Структура нарушения, коды, диагноз",
    tier: "first",
    probes: {
      fields: ["predx", "finaldx", "dur_mo", "st_form0"],
      struct: true,
      sdx: true,
    },
    tools: [
      { id: "opd", label: "OPD-3" },
      { id: "pd", label: "Личность F60" },
    ],
  },
  {
    id: "plan",
    title: "План",
    desc: "Консультации, секстерапия, фармакотерапия, реадаптация",
    tier: "first",
    probes: {
      fields: ["plan_sex", "plan_pt", "plan_rx", "labs"],
      chips: ["cons", "sexth"],
    },
    tools: [{ id: "handouts", label: "Каталог раздаток" }],
  },
];

export function sectionById(id) {
  return CARD_SECTIONS.find((s) => s.id === id);
}

export function sectionIndex(id) {
  return CARD_SECTIONS.findIndex((s) => s.id === id);
}

function chipFilled(state, prefix) {
  return Object.keys(state.checks).some((k) => k.startsWith(prefix + ":") && state.checks[k]);
}

function fieldFilled(state, id) {
  return Boolean(String(state.fields[id] ?? "").trim());
}

function ezFilled(state, female) {
  const zones = female ? EZ_F.length + EZ_M.length : EZ_M.length + EZ_F.length;
  let filled = 0;
  for (let i = 0; i < zones; i++) {
    const kinds = female ? (i < EZ_F.length ? ["ezf"] : ["ezm"]) : (i < EZ_M.length ? ["ezm"] : ["ezf"]);
    const idx = female ? (i < EZ_F.length ? i : i - EZ_F.length) : (i < EZ_M.length ? i : i - EZ_M.length);
    const kind = kinds[0];
    const base = `${kind}${idx}`;
    if (fieldFilled(state, base + "s") || fieldFilled(state, base + "o") || fieldFilled(state, base + "m")) {
      filled++;
    }
  }
  return { filled, total: Math.min(6, zones) };
}

function sdxFilled(state) {
  return Object.keys(state.checks).some((k) => k.startsWith("sdx:") && state.checks[k]);
}

function structFilled(state, female) {
  const axes = female ? 3 : 4;
  for (let i = 0; i < axes; i++) {
    if (fieldFilled(state, "st_form" + i) || fieldFilled(state, "st_code" + i) || chipFilled(state, "st_pl" + i)) {
      return true;
    }
  }
  return false;
}

/** @returns {{ filled: number, total: number, done: boolean }} */
export function sectionProgress(state, section) {
  const female = state.patient.sex === "f";
  const p = section.probes;
  let filled = 0;
  let total = 0;

  (p.patient || []).forEach((id) => {
    total++;
    if (String(state.patient[id] ?? "").trim()) filled++;
  });
  (p.fields || []).forEach((id) => {
    total++;
    if (fieldFilled(state, id)) filled++;
  });
  (p.chips || []).forEach((prefix) => {
    if (typeof prefix === "string") {
      total++;
      if (chipFilled(state, prefix)) filled++;
    }
  });
  if (p.chips && typeof p.chips === "object" && !Array.isArray(p.chips)) {
    const list = female ? p.chips.f : p.chips.m;
    list.forEach((prefix) => {
      total++;
      if (chipFilled(state, prefix)) filled++;
    });
  }
  if (p.ez) {
    const ez = ezFilled(state, female);
    total += ez.total;
    filled += ez.filled;
  }
  if (p.struct) {
    total++;
    if (structFilled(state, female)) filled++;
  }
  if (p.sdx) {
    total++;
    if (sdxFilled(state)) filled++;
  }

  const pct = total ? Math.round((filled / total) * 100) : 0;
  return { filled, total, pct, done: pct >= 40 || (p.fields?.includes("complaint") && fieldFilled(state, "complaint")) };
}

export function cardProgress(state) {
  const sections = CARD_SECTIONS.map((s) => ({
    ...s,
    progress: sectionProgress(state, s),
  }));
  const avg = sections.length
    ? Math.round(sections.reduce((n, s) => n + s.progress.pct, 0) / sections.length)
    : 0;
  const firstVisit = sections.filter((s) => s.tier === "first");
  const firstAvg = firstVisit.length
    ? Math.round(firstVisit.reduce((n, s) => n + s.progress.pct, 0) / firstVisit.length)
    : 0;
  return { sections, avg, firstAvg };
}

export function nextIncompleteSection(state, afterId) {
  const start = afterId ? sectionIndex(afterId) + 1 : 0;
  for (let i = start; i < CARD_SECTIONS.length; i++) {
    if (sectionProgress(state, CARD_SECTIONS[i]).pct < 40) return CARD_SECTIONS[i];
  }
  for (let i = 0; i < (afterId ? sectionIndex(afterId) : CARD_SECTIONS.length); i++) {
    if (sectionProgress(state, CARD_SECTIONS[i]).pct < 40) return CARD_SECTIONS[i];
  }
  return null;
}

export function recommendedSections(state) {
  const female = state.patient.sex === "f";
  const focus = Object.keys(state.checks)
    .filter((k) => k.startsWith("visit_prob:") && state.checks[k])
    .map((k) => k.split(":")[1]);
  const rec = new Set(["problem", "function", "soma"]);

  if (focus.some((f) => ["ЭД", "ПЭ", "пара"].includes(f)) || chipFilled(state, "erect_gone")) {
    rec.add("partner");
    rec.add("ez");
  }
  if (focus.some((f) => ["любрикация", "боль", "спазм"].includes(f)) || female) {
    rec.add("partner");
  }
  if (chipFilled(state, "chr") || fieldFilled(state, "meds")) rec.add("struct");
  if (fieldFilled(state, "complaint")) {
    rec.add("struct");
    rec.add("plan");
  }

  return CARD_SECTIONS.filter((s) => rec.has(s.id) && sectionProgress(state, s).pct < 40);
}
