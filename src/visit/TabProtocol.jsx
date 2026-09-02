import { useMemo } from "react";
import { buildProtocol } from "../lib/summary.js";
import { useStore, activeVisit } from "../store/useStore.js";
import { scoreScale, SCALES } from "../data/scales.js";

export default function TabProtocol() {
  const state = useStore();
  const visit = activeVisit(state);
  const text = useMemo(() => buildProtocol(state), [state]);

  const scores = SCALES.map((s) => {
    if (s.sex && s.sex !== state.patient.sex) return null;
    return scoreScale(s.id, visit.fields);
  }).filter(Boolean);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch { /* ignore */ }
  };

  return (
    <div className="tab-pane rise">
      <header className="pane-head">
        <h2>Протокол</h2>
        <p>Текст для амбулаторной карты. Включает симптомы, скоры и структуру.</p>
      </header>

      {scores.length ? (
        <div className="score-strip no-print">
          {scores.map((s) => (
            <div key={s.line} className="score-pill">
              {s.line}
            </div>
          ))}
        </div>
      ) : null}

      <textarea className="protocol" readOnly value={text} />

      <div className="row no-print" style={{ marginTop: 14 }}>
        <button type="button" className="btn" onClick={copy}>Копировать</button>
        <button type="button" className="btn ghost" onClick={() => window.print()}>Печать</button>
      </div>
      <p className="hint" style={{ marginTop: 12 }}>Хранится только в этом браузере. На GitHub данные пациента не уходят.</p>
    </div>
  );
}
