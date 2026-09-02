import { useState } from "react";
import TabSymptoms from "./TabSymptoms.jsx";
import TabInterview from "./TabInterview.jsx";
import TabScales from "./TabScales.jsx";
import TabStructure from "./TabStructure.jsx";
import TabProtocol from "./TabProtocol.jsx";
import { useStore, activeVisit, flatRefinements } from "../store/useStore.js";
import { recommendedScales } from "../data/scales.js";
import { activeModules } from "../data/modules.js";

const TABS = [
  { id: "symptoms", label: "Симптомы" },
  { id: "interview", label: "Интервью" },
  { id: "scales", label: "Опросники" },
  { id: "structure", label: "Структура" },
  { id: "protocol", label: "Протокол" },
];

export default function VisitShell() {
  const [tab, setTab] = useState("symptoms");
  const state = useStore();
  const visit = activeVisit(state);
  const sex = state.patient.sex;
  const refs = flatRefinements(visit);
  const mods = activeModules(sex, visit.domains, refs).length;
  const scales = recommendedScales(sex, visit.domains, refs).length;

  const meta = {
    symptoms: visit.domains.length ? `${visit.domains.length} домен.` : "пусто",
    interview: visit.domains.length ? `${mods} блок.` : "—",
    scales: scales ? `${scales} шкал` : "—",
    structure: visit.formulation ? "есть" : "—",
    protocol: "печать",
  };

  return (
    <div className="visit">
      <nav className="tabs no-print" aria-label="Вкладки приёма">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={"tab" + (tab === t.id ? " on" : "")}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
            <small>{meta[t.id]}</small>
          </button>
        ))}
      </nav>
      <div className="visit-body">
        {tab === "symptoms" && <TabSymptoms />}
        {tab === "interview" && <TabInterview />}
        {tab === "scales" && <TabScales />}
        {tab === "structure" && <TabStructure />}
        {tab === "protocol" && <TabProtocol />}
      </div>
    </div>
  );
}
