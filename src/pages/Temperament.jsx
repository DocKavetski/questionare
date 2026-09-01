import { useEffect } from "react";
import { Group, Field, Scale } from "../ui.jsx";
import { useStore, f, isF } from "../useStore";
import { femaleQuestions, maleQuestions, scoreTemperament, dcmAxes } from "../data/temperament.js";

export default function Temperament() {
  const state = useStore();
  const female = isF();
  const pack = female ? femaleQuestions : maleQuestions;
  const answers = {};
  Object.values(pack).flat().forEach((q) => {
    if (state.fields[q.id]) answers[q.id] = state.fields[q.id];
  });
  const scored = scoreTemperament(female ? "f" : "m", answers);
  useEffect(() => {
    if (scored.typeName && state.fields.temp_type !== scored.typeName) f("temp_type", scored.typeName);
  }, [scored.typeName, state.fields.temp_type]);

  const blocks = [
    ["block1", "I. Биологическая база"],
    ["block2", "II. Вектор возбуждения (драйв)"],
    ["block3", "III. Вектор торможения (помехи)"],
    ["block4", "IV. Абстиненция"],
  ];

  return (
    <>
      <h1>Сексуальный темперамент</h1>
      <p className="lede">
        Ваш бланк из папки «Опросы»: {female ? "женский" : "мужской"} профиль, 13 пунктов, шкала 1–4.
        Рядом — Dual Control (Bancroft / Janssen): SES, SIS1 (неудача), SIS2 (последствия) как клиническая оценка, без чужих формулировок.
      </p>
      <div className="result-hero">
        <h2>{scored.typeName}</h2>
        <p>{scored.typeDesc}</p>
        <p>База {scored.bio} · драйв {scored.drive} · торможение {scored.inhib} · абстиненция {scored.abst}</p>
      </div>
      {blocks.map(([key, title]) => (
        <Group key={key} title={title}>
          {pack[key].map((q) => (
            <Question key={q.id} q={q} />
          ))}
        </Group>
      ))}
      <Group title="Dual Control — клинические оси">
        {dcmAxes.map((ax) => (
          <Field key={ax.id} label={ax.title} hint={ax.hint}><Scale id={ax.id} /></Field>
        ))}
      </Group>
      <p className="footer-note">Не заменяет конституцию бланка Васильченко. Тип — ориентир для секстерапии, не ярлык.</p>
    </>
  );
}

function Question({ q }) {
  const state = useStore();
  const cur = String(state.fields[q.id] || "");
  if (q.scale) {
    return (
      <Field label={q.text} hint="1 — совсем не про меня · 4 — очень про меня">
        <Scale id={q.id} />
      </Field>
    );
  }
  return (
    <Field label={q.text}>
      <div className="opt-grid">
        {q.options.map((o) => (
          <button
            key={o.label}
            type="button"
            className={"opt" + (cur === String(o.value) ? " on" : "")}
            onClick={() => f(q.id, String(o.value))}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}
