import { Group, Field, Scale } from "../../ui.jsx";
import { useStore, f } from "../../useStore";

const IIEF5 = [
  { id: "iief1", label: "Уверенность в эрекции" },
  { id: "iief2", label: "Достаточная твёрдость для пенетрации" },
  { id: "iief3", label: "Удержание эрекции после пенетрации" },
  { id: "iief4", label: "Трудность удержать до конца" },
  { id: "iief5", label: "Удовлетворённость сексом" },
];

const PEDT = [
  { id: "pedt1", label: "Трудно задержать эякуляцию" },
  { id: "pedt2", label: "Эякуляция раньше, чем хочу" },
  { id: "pedt3", label: "Эякуляция от малой стимуляции" },
  { id: "pedt4", label: "Фрустрация из‑за ранней эякуляции" },
  { id: "pedt5", label: "Беспокойство, что партнёрша неудовлетворена" },
];

const FSFI_SHORT = [
  { id: "fsfi_d1", label: "Сексуальное желание / интерес", block: "desire" },
  { id: "fsfi_d2", label: "Сексуальное возбуждение", block: "desire" },
  { id: "fsfi_l1", label: "Смазка (увлажнение)", block: "lub" },
  { id: "fsfi_o1", label: "Оргазм", block: "orgasm" },
  { id: "fsfi_p1", label: "Боль при проникновении", block: "pain" },
  { id: "fsfi_s1", label: "Удовлетворённость", block: "sat" },
];

function sumIds(ids) {
  return ids.reduce((n, id) => n + (Number(f(id)) || 0), 0);
}

function IIEF5Panel() {
  useStore();
  const total = sumIds(IIEF5.map((q) => q.id));
  let grade = "—";
  if (total > 0) {
    if (total <= 7) grade = "тяжёлая ЭД";
    else if (total <= 11) grade = "умеренная";
    else if (total <= 21) grade = "лёгкая";
    else grade = "норма";
  }
  return (
    <Group title="IIEF-5">
      <p className="legend">0 = нет / очень низко · 5 = очень высоко. Сумма ≤21 — дисфункция.</p>
      {IIEF5.map((q) => (
        <Field key={q.id} label={q.label}><Scale id={q.id} max={5} /></Field>
      ))}
      {total > 0 ? <div className="score-box">Сумма: <b>{total}</b> · {grade}</div> : null}
    </Group>
  );
}

function PEDTPanel() {
  useStore();
  const total = sumIds(PEDT.map((q) => q.id));
  let grade = "—";
  if (total >= 11) grade = "ПЭ";
  else if (total >= 9) grade = "вероятно ПЭ";
  else if (total > 0) grade = "нет ПЭ по шкале";
  return (
    <Group title="PEDT">
      <p className="legend">0–4 на вопрос. Сумма ≥11 — ПЭ.</p>
      {PEDT.map((q) => (
        <Field key={q.id} label={q.label}><Scale id={q.id} max={4} min={0} /></Field>
      ))}
      {total > 0 ? <div className="score-box">Сумма: <b>{total}</b> · {grade}</div> : null}
    </Group>
  );
}

function FSFIPanel() {
  useStore();
  const total = sumIds(FSFI_SHORT.map((q) => q.id));
  return (
    <Group title="FSFI (краткая выборка)">
      <p className="legend">0 = нет / очень низко · 5 = очень высоко. Полный FSFI — 19 пунктов; здесь ключевые домены.</p>
      {FSFI_SHORT.map((q) => (
        <Field key={q.id} label={q.label}><Scale id={q.id} max={5} /></Field>
      ))}
      {total > 0 ? <div className="score-box">Сумма (6 items): <b>{total}</b> · полный cutoff ~26.55</div> : null}
    </Group>
  );
}

export default function ScalePanel({ scaleId }) {
  if (scaleId === "iief5") return <IIEF5Panel />;
  if (scaleId === "pedt") return <PEDTPanel />;
  if (scaleId === "fsfi") return <FSFIPanel />;
  return null;
}
