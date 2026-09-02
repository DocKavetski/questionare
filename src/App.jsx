import { useEffect, useState } from "react";
import { useStore, setPatient, reset, isF } from "./useStore";
import { buildSummary } from "./summary.js";
import { cardProgress } from "./data/cardSections.js";
import AdaptiveInterview from "./pages/AdaptiveInterview.jsx";
import Card from "./pages/Card.jsx";
import Temperament from "./pages/Temperament.jsx";
import Interview from "./pages/Interview.jsx";
import Opd from "./pages/Opd.jsx";
import Comorbid from "./pages/Comorbid.jsx";
import Personality, { Screen } from "./pages/Personality.jsx";
import Handouts from "./pages/Handouts.jsx";
import Summary from "./pages/Summary.jsx";

const NAV = [
  { g: "Приём", items: [
    { id: "interview", t: "Интервью" },
    { id: "summary", t: "Протокол" },
  ]},
  { g: "Карта", items: [
    { id: "card", t: "Полная карта" },
  ]},
  { g: "Опросники", items: [
    { id: "temp", t: "Темперамент" },
    { id: "interview_hints", t: "Подсказки «?»" },
    { id: "opd", t: "OPD-3" },
    { id: "comorbid", t: "Депрессия / тревога" },
    { id: "pd", t: "Личность F60" },
    { id: "screen", t: "Скрининг" },
  ]},
  { g: "Пациенту", items: [
    { id: "handouts", t: "Раздатки и АД" },
  ]},
];

function parseHash() {
  const h = (location.hash || "#interview").slice(1);
  if (h.startsWith("handout/")) return { view: "handouts", extra: h.split("/")[1] };
  if (h.startsWith("card/")) return { view: "card", extra: h.split("/")[1] };
  if (h === "card") return { view: "card", extra: null };
  if (h === "interview_hints") return { view: "interview", extra: null };
  return { view: h || "interview", extra: null };
}

function navActive(view, extra, id) {
  if (id === "card") return view === "card" && !extra;
  if (id === "interview") return view === "interview";
  if (id === "interview_hints") return view === "interview";
  return view === id;
}

export default function App() {
  const state = useStore();
  const [{ view, extra }, setRoute] = useState(parseHash);
  const [toast, setToast] = useState("");
  const { firstAvg } = cardProgress(state);

  useEffect(() => {
    if (!location.hash) location.hash = "interview";
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (id) => {
    location.hash = id;
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(state));
      showToast("Сводка скопирована");
    } catch {
      showToast("Не удалось скопировать");
    }
  };

  const p = state.patient;
  let page = null;
  if (view === "interview") page = <AdaptiveInterview go={go} />;
  else if (view === "interview_hints") page = <Interview />;
  else if (view === "card") page = <Card extra={extra} go={go} />;
  else if (view === "temp") page = <Temperament />;
  else if (view === "opd") page = <Opd />;
  else if (view === "comorbid") page = <Comorbid />;
  else if (view === "pd") page = <Personality />;
  else if (view === "screen") page = <Screen />;
  else if (view === "handouts") page = <Handouts extra={extra} go={go} />;
  else if (view === "summary") page = <Summary go={go} />;
  else page = <AdaptiveInterview go={go} />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Сексология<small>{isF() ? "женщины" : "мужчины"} · адаптивное интервью</small></div>
        <div className="patient-bar">
          <select value={p.sex} onChange={(e) => setPatient({ sex: e.target.value })}>
            <option value="m">муж.</option>
            <option value="f">жен.</option>
          </select>
          <input placeholder="№ карты" value={p.cardNo} onChange={(e) => setPatient({ cardNo: e.target.value })} style={{ width: 88 }} />
          <input placeholder="ФИО" value={p.name} onChange={(e) => setPatient({ name: e.target.value })} />
          <input type="number" placeholder="лет" min="14" max="120" value={p.age} onChange={(e) => setPatient({ age: e.target.value })} />
          <input type="date" value={p.date} onChange={(e) => setPatient({ date: e.target.value })} />
        </div>
        <div className="top-actions">
          <span className="card-pill no-print" title="Заполнение карты">{firstAvg}%</span>
          <button className="ghost" type="button" onClick={copySummary}>Копировать</button>
          <button type="button" onClick={() => window.print()}>Печать</button>
          <button className="ghost" type="button" onClick={() => {
            if (confirm("Новая карта? Текущие ответы сотрутся.")) reset();
          }}>Новая</button>
        </div>
      </header>
      <aside className="sidebar">
        {NAV.map((g) => (
          <div key={g.g}>
            <div className="nav-label">{g.g}</div>
            {g.items.map((it) => (
              <button key={it.id} type="button" className={"nav-btn" + (navActive(view, extra, it.id) ? " active" : "")} onClick={() => go(it.id === "interview_hints" ? "interview_hints" : it.id)}>
                {it.t}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <main className="main"><div className="wrap" key={view + (extra || "")}>{page}</div></main>
      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </div>
  );
}
