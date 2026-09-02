import { redFlags, sexDx, structAxes, comorbidCodes } from "./data/clinical.js";
import { visitFocus } from "./data/fields.js";
import { ruDate } from "./store.js";

export function buildSummary(state) {
  const p = state.patient;
  const female = p.sex === "f";
  const sel = (prefix, opts) => opts.filter((o) => state.checks[prefix + ":" + o]);
  const fv = (id) => state.fields[id] || "";
  const lines = [
    `КАРТА СЕКСОЛОГИЧЕСКОГО ОБСЛЕДОВАНИЯ (${female ? "ж" : "м"})`,
    `Дата: ${ruDate(p.date)}  № ${p.cardNo || "—"}`,
    `Пациент: ${p.name || "—"}, ${p.age || "?"} лет`,
  ];
  const flags = redFlags(state);
  if (flags.length) lines.push("ФЛАГИ: " + flags.join("; "));
  if (fv("complaint") || fv("iv_what")) lines.push("Жалоба: " + (fv("complaint") || fv("iv_what")));
  if (fv("problem")) lines.push("Проблема: " + fv("problem"));
  if (fv("last_coitus")) lines.push("Последний коитус: " + fv("last_coitus"));
  const visitChips = sel("visit_prob", visitFocus(female));
  if (visitChips.length) lines.push("Фокус визита: " + visitChips.join(", "));
  if (!female) {
    const er = sel("erect_coitus", ["быстрой возбудимости", "средней", "медленной", "полные", "неполные", "неполные ослабленные", "отсутствуют"]);
    if (er.length) lines.push("Эрекции при коитусе: " + er.join(", "));
    const ej = sel("ejac_when", ["до пенетрации", "в момент пенетрации", "после начала фрикций", "отсутствует"]);
    if (ej.length) lines.push("Эякуляция: " + ej.join(", ") + (fv("ejac_sec") ? ` через ${fv("ejac_sec")}` : ""));
  } else {
    const lub = sel("lub_fore", ["высокая", "умеренная", "низкая", "отсутствует"]);
    if (lub.length) lines.push("Любрикация (ласки): " + lub.join(", "));
    const pen = sel("pen_f", ["удаётся свободно", "затруднена", "не удаётся"]);
    if (pen.length) lines.push("Пенетрация: " + pen.join(", "));
    if (fv("menarche")) lines.push("Менархе: " + fv("menarche") + " лет");
  }
  if (fv("org_pct")) lines.push("% оргастичности: " + fv("org_pct"));
  if (fv("sat")) lines.push("Удовлетворение (0–10): " + fv("sat"));
  if (fv("goal")) lines.push("Цель: " + fv("goal"));
  if (fv("meds")) lines.push("Лекарства: " + fv("meds"));
  if (fv("temp_type")) lines.push("Темперамент: " + fv("temp_type"));
  const dcm = ["dcm_ses", "dcm_sis1", "dcm_sis2"].map((id) => fv(id)).filter(Boolean);
  if (dcm.length) lines.push("Dual Control SES/SIS1/SIS2: " + ["dcm_ses", "dcm_sis1", "dcm_sis2"].map((id) => fv(id) || "—").join("/"));
  const dx = sexDx(female).filter((x) => state.checks["sdx:" + x.id]);
  if (dx.length) lines.push("МКБ к рассмотрению: " + dx.map((x) => x.codes + " " + x.t).join("; "));
  const cm = comorbidCodes(state);
  if (cm.length) lines.push("Коморбидность: " + cm.join(", "));
  if (fv("predx")) lines.push("Предварительный диагноз: " + fv("predx"));
  if (fv("finaldx")) lines.push("Заключительный диагноз: " + fv("finaldx"));
  structAxes(female).forEach((pair, i) => {
    const form = fv("st_form" + i), code = fv("st_code" + i);
    const place = sel("st_pl" + i, ["ведущая", "сопутствующая", "следствие"]).join(", ");
    if (form || code || place) lines.push(`${pair[0]}: ${form || "—"} [${code || "—"}] место: ${place || "—"}`);
  });
  if (fv("plan_pt")) lines.push("Психотерапия: " + fv("plan_pt"));
  if (fv("plan_sex")) lines.push("Секстерапия: " + fv("plan_sex"));
  if (fv("plan_rx")) lines.push("Фармакотерапия: " + fv("plan_rx"));
  if (fv("opd_sum")) lines.push("OPD: " + fv("opd_sum"));
  return lines.join("\n");
}
