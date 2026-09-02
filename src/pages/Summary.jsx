import { useStore } from "../useStore";
import { buildSummary } from "../summary.js";
import { redFlags } from "../data/clinical.js";
import { CARD_SECTIONS, cardProgress } from "../data/cardSections.js";

export default function Summary({ go }) {
  const state = useStore();
  const text = buildSummary(state);
  const flags = redFlags(state);
  const { sections, firstAvg, avg } = cardProgress(state);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
  };

  return (
    <>
      <h1>Протокол</h1>
      <p className="lede">Текст для амбулаторной карты. Заполнение карты: {firstAvg}% (первый визит), {avg}% (всего).</p>
      {flags.length ? <div className="flag">⚠ {flags.join(" · ")}</div> : null}

      <div className="grid cards sec-grid no-print" style={{ marginBottom: 16 }}>
        {sections.map((s) => (
          <button key={s.id} type="button" className="card click sec-card" onClick={() => go("card/" + s.id)}>
            <h3>{s.title}</h3>
            <div className="sec-card-bar"><i style={{ width: s.progress.pct + "%" }} /></div>
            <span className="sec-card-meta">{s.progress.pct}%</span>
          </button>
        ))}
      </div>

      <textarea readOnly value={text} style={{ minHeight: 420 }} />
      <p className="row" style={{ marginTop: 10 }}>
        <button className="btn" type="button" onClick={copy}>Копировать</button>
        <button className="btn ghost" type="button" onClick={() => window.print()}>Печать</button>
        <button className="btn ghost" type="button" onClick={() => go("card")}>К карте</button>
      </p>
      <p className="footer-note">Вставьте в протокол. Хранится только в этом браузере. На GitHub пациентские данные не уходят.</p>
    </>
  );
}
