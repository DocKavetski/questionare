import { domainsFor, refinementsFor } from "../data/symptoms.js";
import { useStore, toggleDomain, toggleRefinement, activeVisit } from "../store/useStore.js";
import { Text, Field } from "../components/ui.jsx";

export default function TabSymptoms() {
  const state = useStore();
  const visit = activeVisit(state);
  const sex = state.patient.sex;
  const domains = domainsFor(sex);

  return (
    <div className="tab-pane rise">
      <header className="pane-head">
        <h2>Симптомы</h2>
        <p>Два уровня: домен, затем уточнение. От выбора зависит интервью и опросники.</p>
      </header>

      <Field label="Жалоба словами пациента">
        <Text id="complaint" area placeholder="Что не так с сексом / парой / телом" />
      </Field>

      <div className="domain-grid">
        {domains.map((d) => {
          const on = visit.domains.includes(d.id);
          return (
            <button
              key={d.id}
              type="button"
              className={"domain-card" + (on ? " on" : "")}
              onClick={() => toggleDomain(d.id)}
            >
              <span className="domain-label">{d.label}</span>
              <span className="domain-hint">{d.hint}</span>
            </button>
          );
        })}
      </div>

      {visit.domains.map((domainId) => {
        const refs = refinementsFor(domainId);
        if (!refs.length) return null;
        const domain = domains.find((d) => d.id === domainId);
        const selected = visit.refinements[domainId] || [];
        return (
          <section key={domainId} className="refine-block rise">
            <h3>Уточнение · {domain?.label}</h3>
            <div className="chips">
              {refs.map((r) => {
                const on = selected.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={"chip btn-chip" + (on ? " on" : "")}
                    onClick={() => toggleRefinement(domainId, r.id)}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {!visit.domains.length ? (
        <p className="empty-hint">Отметьте хотя бы один домен — откроются уточнения и вкладка «Интервью».</p>
      ) : null}
    </div>
  );
}
