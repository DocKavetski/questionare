/** Structural diagnosis axes */

export function structureAxes(sex) {
  if (sex === "c") {
    return [
      { id: "him", title: "I. Его составляющая", hint: "эрекция, эякуляция, желание, соматика, АД" },
      { id: "her", title: "II. Её составляющая", hint: "желание, возбуждение, боль, оргазм, соматика" },
      { id: "dyad", title: "III. Диадическая", hint: "коммуникация, конфликт, сценарий, власть" },
      { id: "context", title: "IV. Контекст", hint: "условия, дети, ритм жизни, культура" },
    ];
  }
  if (sex === "f") {
    return [
      { id: "neuro", title: "I. Нейрогуморальная", hint: "гормоны, цикл, климакс, конституция, соматика, лекарства" },
      { id: "psych", title: "II. Психическая (корковая)", hint: "тревога, сценарии, пара, травма" },
      { id: "genito", title: "III. Генитосегментарная", hint: "смазка, спазм, боль, оргазм" },
    ];
  }
  return [
    { id: "neuro", title: "I. Нейрогуморальная", hint: "гормоны, конституция, возраст, соматика, лекарства" },
    { id: "psych", title: "II. Психическая (корковая)", hint: "тревога ожидания, сценарии, пара, травма" },
    { id: "erect", title: "III. Эрекционная", hint: "васкулярная, неврогенная, ситуационная" },
    { id: "ejac", title: "IV. Эякуляторная", hint: "ПЭ, задержка, ретроградная" },
  ];
}

export const PLACE = ["ведущая", "сопутствующая", "следствие"];

export function suggestLeadingAxes(sex, domains, refinements) {
  const d = new Set(domains);
  const r = new Set(refinements);
  const tips = [];
  if (sex === "c") {
    if (d.has("m_symptom") || r.has("m_ed") || r.has("m_pe")) tips.push("him");
    if (d.has("f_symptom") || r.has("f_pain") || r.has("f_lub")) tips.push("her");
    if (d.has("conflict") || d.has("desire_gap") || d.has("sex_script")) tips.push("dyad");
    if (d.has("conditions")) tips.push("context");
    if (d.has("who") && !tips.length) tips.push("dyad");
    return [...new Set(tips)];
  }
  if (d.has("iatrogenic") || r.has("ssri") || r.has("coc")) tips.push("neuro");
  if (d.has("desire") && !d.has("erection")) tips.push("neuro", "psych");
  if (d.has("erection") && (r.has("situational") || r.has("partner_only"))) tips.push("psych", "erect");
  if (d.has("erection") && r.has("generalized")) tips.push("erect", "neuro");
  if (d.has("ejaculation")) tips.push("ejac", "psych");
  if (d.has("arousal") || d.has("pain")) tips.push("genito", "psych");
  if (d.has("partner")) tips.push("psych");
  if (d.has("orgasm")) tips.push(sex === "f" ? "genito" : "psych");
  return [...new Set(tips)];
}
