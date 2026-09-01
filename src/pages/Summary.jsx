import { useStore } from "../useStore";
import { buildSummary } from "../summary.js";
import { redFlags } from "../data/clinical.js";

export default function Summary() {
  const state = useStore();
  const text = buildSummary(state);
  const flags = redFlags(state);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
  };
  return (
    <>
      <h1>Снимок карты</h1>
      {flags.length ? <div className="flag">⚠ {flags.join(" · ")}</div> : null}
      <textarea readOnly value={text} style={{ minHeight: 420 }} />
      <p className="row" style={{ marginTop: 10 }}>
        <button className="btn" type="button" onClick={copy}>Копировать</button>
        <button className="btn ghost" type="button" onClick={() => window.print()}>Печать</button>
      </p>
      <p className="footer-note">Вставьте в протокол. Хранится только в этом браузере. На GitHub пациентские данные не уходят.</p>
    </>
  );
}
