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
  c: [
    { id: "who", label: "Кто с запросом", hint: "он / она / оба" },
    { id: "desire_gap", label: "Расхождение желания", hint: "кто хочет чаще" },
    { id: "m_symptom", label: "Симптом у него", hint: "эрекция, ПЭ, желание" },
    { id: "f_symptom", label: "Симптом у неё", hint: "желание, смазка, боль" },
    { id: "conflict", label: "Конфликт", hint: "упрёки, давление, избегание" },
    { id: "sex_script", label: "Сценарий секса", hint: "ласки, позиции, скука" },
    { id: "conditions", label: "Условия", hint: "дом, дети, время" },
    { id: "iatrogenic", label: "Ятрогенное", hint: "АД / КОК у кого-то" },
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
  who: [
    { id: "him", label: "он пришёл с запросом" },
    { id: "her", label: "она с запросом" },
    { id: "both", label: "оба" },
    { id: "pressured", label: "один под давлением" },
  ],
  desire_gap: [
    { id: "he_higher", label: "он хочет чаще" },
    { id: "she_higher", label: "она хочет чаще" },
    { id: "both_low", label: "оба низко" },
    { id: "mismatch_timing", label: "разный ритм / время" },
  ],
  m_symptom: [
    { id: "m_ed", label: "эрекция" },
    { id: "m_pe", label: "ПЭ" },
    { id: "m_desire", label: "желание ↓" },
    { id: "m_orgasm", label: "оргазм" },
  ],
  f_symptom: [
    { id: "f_desire", label: "желание ↓" },
    { id: "f_lub", label: "смазка" },
    { id: "f_orgasm", label: "оргазм" },
    { id: "f_pain", label: "боль / спазм" },
  ],
  conflict: [
    { id: "blame", label: "упрёки" },
    { id: "pressure_sex", label: "давление к сексу" },
    { id: "avoid_touch", label: "избегание близости" },
    { id: "affair_threat", label: "угроза изменой / уходом" },
  ],
  sex_script: [
    { id: "short_fore", label: "мало ласк" },
    { id: "stereotype", label: "стереотипный сценарий" },
    { id: "no_talk", label: "не говорят о желаниях" },
    { id: "porn_gap", label: "разрыв фантазий / порно" },
  ],
  conditions: [
    { id: "kids", label: "дети / родственники" },
    { id: "no_privacy", label: "нет изоляции" },
    { id: "tired", label: "усталость / смены" },
    { id: "separate_beds", label: "раздельная постель" },
  ],
};

export function domainsFor(sex) {
  if (sex === "f") return DOMAINS.f;
  if (sex === "c") return DOMAINS.c;
  return DOMAINS.m;
}

export function refinementsFor(domainId) {
  return REFINEMENTS[domainId] || [];
}
