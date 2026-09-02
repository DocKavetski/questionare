import { useState } from "react";
import { useStore, chk, f } from "./useStore";

export function Group({ title, children }) {
  return (
    <section className="group">
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}

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

export function Scale({ id, max = 4, min = 1 }) {
  useStore();
  const cur = String(f(id));
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <div className="scale">
      {nums.map((n) => (
        <label key={n} className={cur === String(n) ? "on" : ""}>
          <input
            type="radio"
            name={id}
            checked={cur === String(n)}
            onChange={() => f(id, String(n))}
          />
          {n}
        </label>
      ))}
    </div>
  );
}

export function Check({ id, children }) {
  useStore();
  const on = chk(id);
  return (
    <label className="check">
      <input type="checkbox" checked={on} onChange={(e) => chk(id, e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

export function HintQ({ id, title, hints }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"q field" + (open ? " open" : "")}>
      <label>
        {title}
        <button type="button" className="hint-toggle" aria-label="подсказка" onClick={() => setOpen((v) => !v)}>?</button>
      </label>
      <div className="hint-box">
        <strong>Подсказка</strong>
        {hints.map((h) => (
          <div key={h}>• {h}</div>
        ))}
      </div>
      <Text id={id} area />
    </div>
  );
}

export function Select({ id, options }) {
  useStore();
  return (
    <select value={f(id)} onChange={(e) => f(id, e.target.value)}>
      <option value="">—</option>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const t = typeof o === "string" ? o : o.label;
        return <option key={v} value={v}>{t}</option>;
      })}
    </select>
  );
}
