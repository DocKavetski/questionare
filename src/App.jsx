import { useStore, setPatient, setSex, resetCase, newVisit, selectVisit, activeVisit, ruDate, setVisitMeta } from "./store/useStore.js";
import { themeClass, profileMeta, nextProfile } from "./data/profiles.js";
import SexGate from "./components/SexGate.jsx";
import VisitShell from "./visit/VisitShell.jsx";
import { buildProtocol } from "./lib/summary.js";

export default function App() {
  const state = useStore();
  const sex = state.patient.sex;
  const visit = activeVisit(state);
  const visitIndex = state.visits.findIndex((v) => v.id === visit.id) + 1;

  if (!sex) return <SexGate />;

  const meta = profileMeta(sex);
  const p = state.patient;
  const couple = sex === "c";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildProtocol(state));
    } catch { /* ignore */ }
  };

  return (
    <div className={"app " + themeClass(sex)}>
      <header className="topbar no-print">
        <div className="brand">
          <span>Сексология</span>
          <small>{meta.short} · визит {visitIndex}</small>
        </div>
        <div className="patient-bar">
          <input placeholder="№" value={p.cardNo} onChange={(e) => setPatient({ cardNo: e.target.value })} style={{ width: 72 }} />
          {couple ? (
            <>
              <input placeholder="Он" value={p.name} onChange={(e) => setPatient({ name: e.target.value })} />
              <input placeholder="Она" value={p.name2 || ""} onChange={(e) => setPatient({ name2: e.target.value })} />
            </>
          ) : (
            <input placeholder="ФИО" value={p.name} onChange={(e) => setPatient({ name: e.target.value })} />
          )}
          <input type="number" placeholder={couple ? "лет он" : "лет"} min="14" max="120" value={p.age} onChange={(e) => setPatient({ age: e.target.value })} style={{ width: 64 }} />
          {couple ? (
            <input type="number" placeholder="лет она" min="14" max="120" value={p.age2 || ""} onChange={(e) => setPatient({ age2: e.target.value })} style={{ width: 72 }} />
          ) : null}
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
            if (confirm("Сменить профиль? Маршрут и оформление изменятся.")) setSex(nextProfile(sex));
          }}>→ {profileMeta(nextProfile(sex)).label.toLowerCase()}</button>
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
