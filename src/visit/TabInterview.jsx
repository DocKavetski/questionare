import { activeModules } from "../data/modules.js";
import { useStore, activeVisit, flatRefinements } from "../store/useStore.js";
import { ModuleBlock } from "../components/ui.jsx";

export default function TabInterview() {
  const state = useStore();
  const visit = activeVisit(state);
  const sex = state.patient.sex;
  const modules = activeModules(sex, visit.domains, flatRefinements(visit));

  return (
    <div className="tab-pane rise">
      <header className="pane-head">
        <h2>Интервью</h2>
        <p>
          {visit.domains.length
            ? `${modules.length} блоков по выбранным симптомам`
            : "Сначала отметьте симптомы — модули появятся здесь"}
        </p>
      </header>

      {!visit.domains.length ? (
        <p className="empty-hint">Нет активных доменов. Вернитесь на вкладку «Симптомы».</p>
      ) : (
        modules.map((m) => <ModuleBlock key={m.id} module={m} sex={sex} />)
      )}
    </div>
  );
}
