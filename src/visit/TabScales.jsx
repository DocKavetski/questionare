import { recommendedScales, scoreScale } from "../data/scales.js";
import { useStore, activeVisit, flatRefinements } from "../store/useStore.js";
import { Field, Scale } from "../components/ui.jsx";

export default function TabScales() {
  const state = useStore();
  const visit = activeVisit(state);
  const sex = state.patient.sex;
  const scales = recommendedScales(sex, visit.domains, flatRefinements(visit));

  const printScale = (scaleId) => {
    document.body.dataset.printScale = scaleId;
    window.print();
    delete document.body.dataset.printScale;
  };

  return (
    <div className="tab-pane rise">
      <header className="pane-head">
        <h2>Опросники</h2>
        <p>Встроенные шкалы по показаниям. Скор сразу попадает в протокол.</p>
      </header>

      {!scales.length ? (
        <p className="empty-hint">Нет рекомендованных шкал. Отметьте симптомы — появятся IIEF‑5, PEDT, FSFI и др.</p>
      ) : null}

      {scales.map((scale) => {
        const scored = scoreScale(scale.id, visit.fields);
        return (
          <section key={scale.id} className="scale-card block" data-scale={scale.id}>
            <div className="scale-card-head">
              <div>
                <h3>{scale.title}</h3>
                <p className="hint">{scale.short}</p>
              </div>
              <button type="button" className="btn ghost no-print" onClick={() => printScale(scale.id)}>
                Печать
              </button>
            </div>
            {scale.items.map((item) => (
              <Field key={item.id} label={item.label}>
                <Scale id={item.id} min={scale.min} max={scale.max} />
              </Field>
            ))}
            {scored ? (
              <div className="score-box">
                <strong>{scored.total}</strong>
                <span>{scored.grade}</span>
              </div>
            ) : (
              <p className="hint">Отметьте все пункты — появится сумма</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
