import { useEffect, useState } from "react";
import { useStore, setPatient, reset, isF } from "./useStore";
import { buildSummary } from "./summary.js";
import Visit from "./pages/Visit.jsx";
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
    { id: "visit", t: "Сценарий приёма" },
    { id: "summary", t: "Снимок" },
  ]},
  { g: "Карта", items: [
    { id: "card", t: "Полная карта" },
  ]},
  { g: "Опросники", items: [
    { id: "temp", t: "Темперамент" },
    { id: "interview", t: "Интервью с ?" },
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
  const h = (location.hash || "#visit").slice(1);
  if (h.startsWith("handout/")) return { view: "handouts", extra: h.split("/")[1] };
  if (h.startsWith("card/")) return { view: "card", extra: h.split("/")[1] };
  return { view: h || "visit", extra: null };
}

export default function App() {
  const state = useStore();
  const [{ view, extra }, setRoute] = useState(parseHash);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!location.hash) location.hash = "visit";
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
  if (view === "visit") page = <Visit go={go} />;
  else if (view === "card") page = <Card extra={extra} go={go} />;
  else if (view === "temp") page = <Temperament />;
  else if (view === "interview") page = <Interview />;
  else if (view === "opd") page = <Opd />;
  else if (view === "comorbid") page = <Comorbid />;
  else if (view === "pd") page = <Personality />;
  else if (view === "screen") page = <Screen />;
  else if (view === "handouts") page = <Handouts extra={extra} go={go} />;
  else if (view === "summary") page = <Summary />;
  else page = <Visit go={go} />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Сексология<small>{isF() ? "женщины" : "мужчины"} · быстрый приём</small></div>
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
              <button key={it.id} type="button" className={"nav-btn" + (view === it.id ? " active" : "")} onClick={() => go(it.id)}>
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
