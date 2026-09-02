import { structureAxes, PLACE, suggestLeadingAxes } from "../data/structure.js";
import { useStore, activeVisit, flatRefinements, setStructureAxis, setVisitMeta } from "../store/useStore.js";
import { Field } from "../components/ui.jsx";

export default function TabStructure() {
  const state = useStore();
  const visit = activeVisit(state);
  const sex = state.patient.sex;
  const axes = structureAxes(sex);
  const tips = suggestLeadingAxes(sex, visit.domains, flatRefinements(visit));

  return (
    <div className="tab-pane rise">
      <header className="pane-head">
        <h2>Структура</h2>
        <p>Структурный диагноз: форма, шифр, место в структуре нарушения.</p>
      </header>

      {tips.length ? (
        <p className="tip-bar">
          По симптомам чаще ведущие:{" "}
          {tips.map((id) => axes.find((a) => a.id === id)?.title).filter(Boolean).join(" · ")}
        </p>
      ) : null}

      {axes.map((ax) => {
        const s = visit.structure[ax.id] || {};
        return (
          <section key={ax.id} className="block rise">
            <h3>{ax.title}</h3>
            <p className="hint">{ax.hint}</p>
            <Field label="Форма нарушения">
              <input
                value={s.form || ""}
                onChange={(e) => setStructureAxis(ax.id, { form: e.target.value })}
                placeholder="своими словами"
              />
            </Field>
            <Field label="Шифр">
              <input
                className="mini"
                value={s.code || ""}
                onChange={(e) => setStructureAxis(ax.id, { code: e.target.value })}
                placeholder="МКБ"
              />
            </Field>
            <Field label="Место">
              <div className="chips">
                {PLACE.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={"chip btn-chip" + (s.place === p ? " on" : "")}
                    onClick={() => setStructureAxis(ax.id, { place: p })}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>
          </section>
        );
      })}

      <section className="block rise">
        <h3>Формулировка и план</h3>
        <Field label="Формулировка случая">
          <textarea
            value={visit.formulation}
            onChange={(e) => setVisitMeta({ formulation: e.target.value })}
            placeholder="1–3 предложения для протокола"
          />
        </Field>
        <Field label="План">
          <textarea
            value={visit.plan}
            onChange={(e) => setVisitMeta({ plan: e.target.value })}
            placeholder="индивид / пара / фарма / направления"
          />
        </Field>
        <Field label="На следующий визит">
          <textarea
            value={visit.nextVisit}
            onChange={(e) => setVisitMeta({ nextVisit: e.target.value })}
            placeholder="что не успели, что проверить"
          />
        </Field>
      </section>
    </div>
  );
}
