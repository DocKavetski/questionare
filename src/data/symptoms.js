/** Two-level symptom taxonomy for adaptive interview */

export const DOMAINS = {
  m: [
    { id: "desire", label: "Желание", hint: "либидо, инициатива" },
    { id: "erection", label: "Эрекция", hint: "твёрдость, удержание" },
    { id: "ejaculation", label: "Эякуляция", hint: "ПЭ, задержка" },
    { id: "orgasm", label: "Оргазм", hint: "качество, ангедония" },
    { id: "pain", label: "Боль", hint: "дискомфорт при сексе" },
    { id: "partner", label: "Пара", hint: "отношения, конфликт" },
    { id: "iatrogenic", label: "Ятрогенное", hint: "АД, препараты" },
  ],
  f: [
    { id: "desire", label: "Желание", hint: "интерес, инициатива" },
    { id: "arousal", label: "Возбуждение", hint: "смазка, набухание" },
    { id: "orgasm", label: "Оргазм", hint: "достижение, качество" },
    { id: "pain", label: "Боль / спазм", hint: "пенетрация, vaginismus" },
    { id: "partner", label: "Пара", hint: "отношения, конфликт" },
    { id: "iatrogenic", label: "Ятрогенное", hint: "АД, КОК" },
  ],
};

export const REFINEMENTS = {
  desire: [
    { id: "spontaneous", label: "спонтанное ↓" },
    { id: "responsive", label: "реактивное ↓" },
    { id: "partner_specific", label: "только в этой паре" },
    { id: "global", label: "во всех ситуациях" },
  ],
  erection: [
    { id: "generalized", label: "генерализованная" },
    { id: "situational", label: "ситуационная" },
    { id: "partner_only", label: "с партнёршей" },
    { id: "masturbation_ok", label: "при мастурбации ОК" },
    { id: "morning_absent", label: "утренних нет" },
  ],
  ejaculation: [
    { id: "pe", label: "преждевременная" },
    { id: "delayed", label: "задержка / нет" },
    { id: "before_penetration", label: "до пенетрации" },
    { id: "loss_of_control", label: "потеря контроля" },
  ],
  orgasm: [
    { id: "absent", label: "отсутствие" },
    { id: "weak", label: "ослабленный" },
    { id: "anhedonia", label: "ангедония" },
    { id: "delayed", label: "задержка" },
  ],
  arousal: [
    { id: "low_lub", label: "низкая смазка" },
    { id: "loss_during", label: "исчезает в процессе" },
    { id: "mental_ok", label: "психически есть, телесно нет" },
  ],
  pain: [
    { id: "entry", label: "на входе" },
    { id: "deep", label: "глубокая" },
    { id: "spasm", label: "спазм / непроходимость" },
    { id: "avoidance", label: "избегание из‑за боли" },
  ],
  partner: [
    { id: "conflict", label: "конфликт" },
    { id: "pressure", label: "давление партнёра" },
    { id: "communication", label: "нет разговора о сексе" },
    { id: "conditions", label: "плохие условия" },
  ],
  iatrogenic: [
    { id: "ssri", label: "СИОЗС / АД" },
    { id: "coc", label: "КОК" },
    { id: "other_meds", label: "другие препараты" },
    { id: "after_start", label: "началось после препарата" },
  ],
};

export function domainsFor(sex) {
  return DOMAINS[sex === "f" ? "f" : "m"];
}

export function refinementsFor(domainId) {
  return REFINEMENTS[domainId] || [];
}
