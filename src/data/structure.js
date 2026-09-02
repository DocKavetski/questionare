/** Structural diagnosis axes (Васильченко / бланк) */

export function structureAxes(sex) {
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

/** Soft hints which axes may be primary given domains */
export function suggestLeadingAxes(sex, domains, refinements) {
  const d = new Set(domains);
  const r = new Set(refinements);
  const tips = [];
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
