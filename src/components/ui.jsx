import DualControlCheat from "./DualControlCheat.jsx";
import { useStore, f, chk } from "../store/useStore.js";

export function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>
        {label}
        {hint ? <span className="hint">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

export function Text({ id, placeholder, area, cls }) {
  useStore();
  const props = {
    value: f(id),
    placeholder: placeholder || "",
    onChange: (e) => f(id, e.target.value),
  };
  if (area) return <textarea {...props} />;
  return <input className={cls || ""} {...props} />;
}

export function Chips({ prefix, opts }) {
  useStore();
  return (
    <div className="chips">
      {opts.map((o) => {
        const id = prefix + ":" + o;
        const on = chk(id);
        return (
          <label key={id} className={"chip" + (on ? " on" : "")}>
            <input type="checkbox" checked={on} onChange={(e) => chk(id, e.target.checked)} />
            <span>{o}</span>
          </label>
        );
      })}
    </div>
  );
}

export function Scale({ id, min = 1, max = 4 }) {
  useStore();
  const cur = String(f(id));
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <div className="scale">
      {nums.map((n) => (
        <label key={n} className={cur === String(n) ? "on" : ""}>
          <input type="radio" name={id} checked={cur === String(n)} onChange={() => f(id, String(n))} />
          {n}
        </label>
      ))}
    </div>
  );
}

export function ModuleBlock({ module, sex }) {
  const items = module.items.filter((it) => !it.sex || it.sex === sex);
  return (
    <section className="block rise">
      <h3>{module.title}</h3>
      {module.id === "dual" ? (
        <p className="hint" style={{ marginBottom: 10 }}>
          Клиническая оценка склонности 1–4. Не валидированный опросник — гипотеза механизма.
        </p>
      ) : null}
      {items.map((item) => {
        if (item.kind === "text") {
          return (
            <Field key={item.id} label={item.label}>
              <Text id={item.id} area={item.area} cls={item.mini ? "mini" : ""} placeholder={item.placeholder} />
            </Field>
          );
        }
        if (item.kind === "chips") {
          return (
            <Field key={item.prefix} label={item.label}>
              <Chips prefix={item.prefix} opts={item.opts} />
            </Field>
          );
        }
        if (item.kind === "scale") {
          return (
            <Field key={item.id} label={item.label}>
              <Scale id={item.id} max={item.max || 4} />
            </Field>
          );
        }
        return null;
      })}
      {module.id === "dual" ? <DualControlCheat /> : null}
    </section>
  );
}
