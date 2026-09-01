import { Group, Field, Text, Chips } from "../ui.jsx";
import { PERSONALITY, SCREEN } from "../data/clinical.js";

export default function Personality() {
  return (
    <>
      <h1>Расстройства личности</h1>
      <p className="lede">Ориентир по МКБ-10 F60 из вашего диагностического бланка. Не полный критериальный опросник — гипотезы для OPD и плана.</p>
      <Group title="Гипотезы">
        <Chips prefix="pd" opts={PERSONALITY.map(([code, name]) => `${code} ${name}`)} />
        <Field label="Заметки"><Text id="pd_note" area /></Field>
      </Group>
    </>
  );
}

export function Screen() {
  return (
    <>
      <h1>Скрининг терапевта</h1>
      <p className="lede">Короткий чек-лист из «просто провериться»: не сексология, а фон приёма. Заполняется за минуту.</p>
      {SCREEN.map((s) => (
        <Group key={s.title} title={s.title}>
          <Chips prefix={s.note} opts={s.chips} />
          <Text id={s.note + "_n"} area placeholder="уточнение" />
        </Group>
      ))}
    </>
  );
}
