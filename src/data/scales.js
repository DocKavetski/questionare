/** Embedded scales with scoring — results feed protocol */

export const SCALES = [
  {
    id: "iief5",
    title: "IIEF-5",
    short: "Эрекция",
    sex: "m",
    domains: ["erection"],
    min: 1,
    max: 5,
    items: [
      { id: "iief1", label: "Уверенность получить и удержать эрекцию" },
      { id: "iief2", label: "Эрекции достаточно твёрдые для пенетрации" },
      { id: "iief3", label: "Удержание после пенетрации" },
      { id: "iief4", label: "Трудность удержать до конца" },
      { id: "iief5", label: "Удовлетворённость попыткой" },
    ],
    score(values) {
      const nums = this.items.map((i) => Number(values[i.id]) || 0);
      if (nums.some((n) => n < 1)) return null;
      const total = nums.reduce((a, b) => a + b, 0);
      let grade = "норма";
      if (total <= 7) grade = "тяжёлая ЭД";
      else if (total <= 11) grade = "умеренная ЭД";
      else if (total <= 21) grade = "лёгкая ЭД";
      return { total, grade, line: `IIEF-5: ${total}/25 · ${grade}` };
    },
  },
  {
    id: "pedt",
    title: "PEDT",
    short: "ПЭ",
    sex: "m",
    domains: ["ejaculation"],
    refinements: ["pe", "before_penetration", "loss_of_control"],
    min: 0,
    max: 4,
    items: [
      { id: "pedt1", label: "Трудно задержать эякуляцию" },
      { id: "pedt2", label: "Эякуляция раньше, чем хочу" },
      { id: "pedt3", label: "Эякуляция от малой стимуляции" },
      { id: "pedt4", label: "Фрустрация из‑за ранней эякуляции" },
      { id: "pedt5", label: "Беспокойство о неудовлетворённости партнёрши" },
    ],
    score(values) {
      const nums = this.items.map((i) => {
        const v = values[i.id];
        return v === "" || v == null ? null : Number(v);
      });
      if (nums.some((n) => n == null || Number.isNaN(n))) return null;
      const total = nums.reduce((a, b) => a + b, 0);
      let grade = "нет ПЭ по шкале";
      if (total >= 11) grade = "ПЭ";
      else if (total >= 9) grade = "вероятно ПЭ";
      return { total, grade, line: `PEDT: ${total}/20 · ${grade}` };
    },
  },
  {
    id: "fsfi6",
    title: "FSFI · ключевые домены",
    short: "Функция",
    sex: "f",
    domains: ["desire", "arousal", "orgasm", "pain"],
    min: 0,
    max: 5,
    items: [
      { id: "fsfi_d", label: "Желание / интерес" },
      { id: "fsfi_a", label: "Возбуждение" },
      { id: "fsfi_l", label: "Смазка" },
      { id: "fsfi_o", label: "Оргазм" },
      { id: "fsfi_p", label: "Боль (0 = сильная, 5 = нет)" },
      { id: "fsfi_s", label: "Удовлетворённость" },
    ],
    score(values) {
      const nums = this.items.map((i) => {
        const v = values[i.id];
        return v === "" || v == null ? null : Number(v);
      });
      if (nums.some((n) => n == null || Number.isNaN(n))) return null;
      const total = nums.reduce((a, b) => a + b, 0);
      return { total, grade: "сумма доменов (краткая форма)", line: `FSFI-ключевые: ${total}/30` };
    },
  },
  {
    id: "asex",
    title: "ASEX · клиническая оценка",
    short: "АД / секс",
    domains: ["iatrogenic"],
    refinements: ["ssri", "after_start"],
    min: 1,
    max: 6,
    items: [
      { id: "asex1", label: "Сила влечения" },
      { id: "asex2", label: "Возбуждение" },
      { id: "asex3", label: "Эрекция / смазка" },
      { id: "asex4", label: "Способность достичь оргазма" },
      { id: "asex5", label: "Удовлетворённость оргазмом" },
    ],
    score(values) {
      const nums = this.items.map((i) => Number(values[i.id]) || 0);
      if (nums.some((n) => n < 1)) return null;
      const total = nums.reduce((a, b) => a + b, 0);
      const flag = total >= 19 || nums.some((n) => n >= 5);
      return {
        total,
        grade: flag ? "клинически значимая дисфункция" : "ниже порога",
        line: `ASEX: ${total}/30 · ${flag ? "значимо" : "ниже порога"}`,
      };
    },
  },
  {
    id: "phq2",
    title: "PHQ-2",
    short: "Депрессия",
    domains: ["desire", "iatrogenic"],
    min: 0,
    max: 3,
    items: [
      { id: "phq1", label: "Мало интереса / удовольствия" },
      { id: "phq2", label: "Подавленность / безнадёжность" },
    ],
    score(values) {
      const a = values.phq1 === "" || values.phq1 == null ? null : Number(values.phq1);
      const b = values.phq2 === "" || values.phq2 == null ? null : Number(values.phq2);
      if (a == null || b == null || Number.isNaN(a) || Number.isNaN(b)) return null;
      const total = a + b;
      return {
        total,
        grade: total >= 3 ? "скрин положительный" : "скрин отрицательный",
        line: `PHQ-2: ${total}/6 · ${total >= 3 ? "положительно" : "отрицательно"}`,
      };
    },
  },
];

export function recommendedScales(sex, domains, refinements) {
  const sexKey = sex === "f" ? "f" : "m";
  const dSet = new Set(domains);
  const rSet = new Set(refinements);
  if (!dSet.size) return [];
  return SCALES.filter((s) => {
    if (s.sex && s.sex !== sexKey) return false;
    if (s.domains?.some((d) => dSet.has(d))) return true;
    if (s.refinements?.some((r) => rSet.has(r))) return true;
    return false;
  });
}

export function scoreScale(scaleId, fields) {
  const scale = SCALES.find((s) => s.id === scaleId);
  if (!scale) return null;
  return scale.score(fields);
}
