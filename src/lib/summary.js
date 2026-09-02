import { SCALES, scoreScale } from "../data/scales.js";
import { structureAxes } from "../data/structure.js";
import { domainsFor } from "../data/symptoms.js";
import { profileMeta } from "../data/profiles.js";
import { ruDate } from "../store/store.js";

export function buildProtocol(state) {
  const p = state.patient;
  const visit = state.visits.find((v) => v.id === state.activeVisitId) || state.visits[0];
  const meta = profileMeta(p.sex);
  const fv = (id) => visit.fields[id] || "";
  const lines = [
    `ПРОТОКОЛ СЕКСОЛОГИЧЕСКОГО ПРИЁМА (${meta.protocol})`,
    `Дата: ${ruDate(visit.date)}`,
    `Визит: ${state.visits.findIndex((v) => v.id === visit.id) + 1} из ${state.visits.length}`,
  ];

  const domainLabels = domainsFor(p.sex)
    .filter((d) => visit.domains.includes(d.id))
    .map((d) => {
      const refs = (visit.refinements[d.id] || []).join(", ");
      return refs ? `${d.label} (${refs})` : d.label;
    });
  if (domainLabels.length) lines.push("Симптомы: " + domainLabels.join("; "));
  if (fv("complaint")) lines.push("Жалоба: " + fv("complaint"));
  if (fv("complaint_him")) lines.push("Его слова: " + fv("complaint_him"));
  if (fv("complaint_her")) lines.push("Её слова: " + fv("complaint_her"));
  if (fv("dur_mo")) lines.push("Длительность: " + fv("dur_mo") + " мес.");
  if (fv("goal")) lines.push("Цель: " + fv("goal"));

  SCALES.forEach((scale) => {
    if (scale.sex && scale.sex !== p.sex) return;
    if (p.sex === "c" && scale.sex && scale.sex !== "c") return;
    const scored = scoreScale(scale.id, visit.fields);
    if (scored) lines.push(scored.line);
  });

  const dcm = ["dcm_ses", "dcm_sis1", "dcm_sis2"].map((id) => fv(id)).filter(Boolean);
  if (dcm.length) lines.push("Dual Control SES/SIS1/SIS2: " + ["dcm_ses", "dcm_sis1", "dcm_sis2"].map((id) => fv(id) || "—").join("/"));

  if (fv("meds")) lines.push("Лекарства: " + fv("meds"));

  lines.push("— Структура —");
  structureAxes(p.sex).forEach((ax) => {
    const s = visit.structure[ax.id] || {};
    if (s.form || s.code || s.place) {
      lines.push(`${ax.title}: ${s.form || "—"} [${s.code || "—"}] · ${s.place || "—"}`);
    }
  });

  if (visit.formulation) lines.push("Формулировка: " + visit.formulation);
  if (visit.plan) lines.push("План: " + visit.plan);
  if (visit.nextVisit) lines.push("На следующий визит: " + visit.nextVisit);

  return lines.join("\n");
}
