import { Group, Field, Text, Chips, Scale } from "../ui.jsx";
import { useStore, f, chk } from "../useStore";
import { redFlags } from "../data/clinical.js";
import {
  symptomList,
  activeSymptomIds,
  activeModules,
  recommendedScales,
  moduleItems,
  resolveOpts,
} from "../data/adaptiveInterview.js";
import ScalePanel from "./scales/ScalePanel.jsx";

function ModuleItem({ item, state }) {
  useStore();
  if (item.kind === "text") {
    return (
      <Field label={item.label} hint={item.hint}>
        <Text id={item.id} area={item.area} cls={item.mini ? "mini" : ""} />
      </Field>
    );
  }
  if (item.kind === "chips") {
    return (
      <Field label={item.label}>
        <Chips prefix={item.prefix} opts={resolveOpts(item, state)} />
      </Field>
    );
  }
  if (item.kind === "scale") {
    return (
      <Field label={item.label} hint={item.hint}>
        <Scale id={item.id} />
      </Field>
    );
  }
  return null;
}

function SymptomPicker({ state, onToggle }) {
  const list = symptomList(state);
  return (
    <Group title="Симптомы сегодня">
      <p className="legend">Отметьте, что актуально — ниже появятся только релевантные блоки и опросники.</p>
      <div className="chips">
        {list.map((s) => {
          const id = "sym:" + s.id;
          const on = !!state.checks[id];
          return (
            <label key={s.id} className={"chip" + (on ? " on" : "")}>
              <input type="checkbox" checked={on} onChange={() => onToggle(s)} />
              <span>{s.label}</span>
            </label>
          );
        })}
      </div>
    </Group>
  );
}

export default function AdaptiveInterview({ go }) {
  const state = useStore();
  const symptoms = activeSymptomIds(state);
  const modules = activeModules(state);
  const scales = recommendedScales(state);
  const flags = redFlags(state);

  const toggleSymptom = (sym) => {
    const id = "sym:" + sym.id;
    const next = !state.checks[id];
    chk(id, next);
    if (sym.visit) chk("visit_prob:" + sym.visit, next);
  };

  const inlineScales = scales.filter((s) => !s.link && ["iief5", "pedt", "fsfi"].includes(s.id));
  const linkedScales = scales.filter((s) => s.link);

  return (
    <>
      <h1>Структурированное интервью</h1>
      <p className="lede">
        Адаптивный приём: симптом → уточняющие вопросы → опросники по показаниям.
        Данные в карте и протоколе.
      </p>
      {flags.length ? <div className="flag">⚠ {flags.join(" · ")}</div> : null}

      <SymptomPicker state={state} onToggle={toggleSymptom} />

      {!symptoms.length ? (
        <p className="rec-box">Отметьте хотя бы один симптом — интервью развернётся под жалобу.</p>
      ) : (
        <>
          <p className="step-meta">{modules.length} блоков · {scales.length} опросников рекомендовано</p>

          {modules.map((mod) => (
            <Group key={mod.id} title={mod.title}>
              {moduleItems(state, mod).map((item) => (
                <ModuleItem key={item.id || item.prefix + item.label} item={item} state={state} />
              ))}
            </Group>
          ))}

          {inlineScales.length ? (
            <div className="scale-section">
              <h2>Опросники</h2>
              {inlineScales.map((s) => (
                <ScalePanel key={s.id} scaleId={s.id} />
              ))}
            </div>
          ) : null}

          {linkedScales.length ? (
            <Group title="Дополнительно по показаниям">
              <div className="row">
                {linkedScales.map((s) => (
                  <button key={s.id} className="btn ghost" type="button" onClick={() => go(s.link)}>
                    {s.title}
                  </button>
                ))}
              </div>
            </Group>
          ) : null}
        </>
      )}

      <div className="visit-nav no-print">
        <button className="btn ghost" type="button" onClick={() => go("card")}>Полная карта</button>
        <button className="btn" type="button" onClick={() => go("summary")}>Протокол</button>
      </div>
    </>
  );
}
