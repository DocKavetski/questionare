import { useStore, setPatient, setSex, resetCase, newVisit, selectVisit, activeVisit, ruDate, setVisitMeta } from "./store/useStore.js";
import SexGate from "./components/SexGate.jsx";
import VisitShell from "./visit/VisitShell.jsx";
import { buildProtocol } from "./lib/summary.js";

export default function App() {
  const state = useStore();
  const sex = state.patient.sex;
  const visit = activeVisit(state);
  const visitIndex = state.visits.findIndex((v) => v.id === visit.id) + 1;

  if (!sex) return <SexGate />;

  const theme = sex === "f" ? "theme-f" : "theme-m";
  const p = state.patient;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildProtocol(state));
    } catch { /* ignore */ }
  };

  return (
    <div className={"app " + theme}>
      <header className="topbar no-print">
        <div className="brand">
          <span>Сексология</span>
          <small>{sex === "f" ? "женщины" : "мужчины"} · визит {visitIndex}</small>
        </div>
        <div className="patient-bar">
          <input placeholder="№" value={p.cardNo} onChange={(e) => setPatient({ cardNo: e.target.value })} style={{ width: 72 }} />
          <input placeholder="ФИО" value={p.name} onChange={(e) => setPatient({ name: e.target.value })} />
          <input type="number" placeholder="лет" min="14" max="120" value={p.age} onChange={(e) => setPatient({ age: e.target.value })} style={{ width: 64 }} />
          <input type="date" value={visit.date} onChange={(e) => setVisitMeta({ date: e.target.value })} style={{ width: 140 }} />
        </div>
        <div className="top-actions">
          <select className="visit-select" value={visit.id} onChange={(e) => selectVisit(e.target.value)} title="Визиты случая">
            {state.visits.map((v, i) => (
              <option key={v.id} value={v.id}>Визит {i + 1} · {ruDate(v.date)}</option>
            ))}
          </select>
          <button type="button" className="ghost" onClick={() => newVisit()}>+ Визит</button>
          <button type="button" className="ghost" onClick={copy}>Копировать</button>
          <button type="button" onClick={() => window.print()}>Печать</button>
          <button type="button" className="ghost" onClick={() => {
            if (confirm("Сменить пол профиля? Маршрут и оформление изменятся.")) setSex(sex === "f" ? "m" : "f");
          }}>{sex === "f" ? "→ муж." : "→ жен."}</button>
          <button type="button" className="ghost" onClick={() => {
            if (confirm("Новый случай? Все визиты будут стёрты.")) resetCase();
          }}>Новый</button>
        </div>
      </header>
      <main className="main">
        <VisitShell />
      </main>
    </div>
  );
}
