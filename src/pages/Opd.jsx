import { Group, Field, Chips, Text, Select } from "../ui.jsx";
import { f } from "../useStore";

export default function Opd() {
  const copy = async () => {
    const t = `OPD-3
I понимание: ${f("opd_und")} / мотивация: ${f("opd_mot")}
ожидания: ${f("opd_exp")}
II цикл: ${f("opd_cyc")}
контрперенос: ${f("opd_ct")}
III дилемма: ${f("opd_dil")}
травмы: ${f("opd_tr")}
IV структура: ${f("opd_st")}
V ${f("opd_icd")} ${f("opd_sym")}
${f("opd_sum")}
план: ${f("opd_plan")}`;
    try { await navigator.clipboard.writeText(t); } catch { /* ignore */ }
  };
  return (
    <>
      <h1>OPD-3 при сексуальной проблеме</h1>
      <p className="lede">Для психогенного слоя: не вместо бланка, а оси мотивации, отношений и структуры.</p>
      <Group title="Ось I. Предпосылки к лечению">
        <Field label="Понимание проблемы">
          <Select id="opd_und" options={[
            { value: "med", label: "Чисто медицинское («это орган»)" },
            { value: "stress", label: "Видит связь со стрессом / парой" },
            { value: "psy", label: "Понимает психологические причины" },
          ]} />
        </Field>
        <Field label="Мотивация">
          <Select id="opd_mot" options={[
            { value: "low", label: "Низкая (настоял партнёр)" },
            { value: "mid", label: "Убрать симптом" },
            { value: "hi", label: "Понять себя и отношения" },
          ]} />
        </Field>
        <Field label="Ожидания"><Text id="opd_exp" area /></Field>
      </Group>
      <Group title="Ось II. Интерперсональный цикл">
        <Field label="Цикл"><Text id="opd_cyc" area placeholder="поведение → реакция партнёра → самовосприятие → снова…" /></Field>
        <Field label="Контрперенос"><Text id="opd_ct" area /></Field>
      </Group>
      <Group title="Ось III. Конфликты">
        <Field label="Индивидуация ↔ принадлежность"><Chips prefix="opd_ind" opts={["← отдельность", "баланс", "слияние →"]} /></Field>
        <Field label="Подчинение ↔ контроль"><Chips prefix="opd_ctrl" opts={["← уступать", "баланс", "доминировать →"]} /></Field>
        <Field label="Самоотдача ↔ забота о себе"><Chips prefix="opd_sac" opts={["← отдача", "баланс", "только о себе →"]} /></Field>
        <Field label="Дилемма"><Text id="opd_dil" area placeholder="если я…, то…" /></Field>
        <Field label="Травмы"><Text id="opd_tr" area /></Field>
      </Group>
      <Group title="Ось IV. Структура">
        <Select id="opd_st" options={[
          { value: "hi", label: "Хорошо интегрированная" },
          { value: "mid", label: "Умеренно нарушенная" },
          { value: "lo", label: "Слабо интегрированная" },
        ]} />
        <Chips prefix="opd_fn" opts={["Регуляция аффекта", "Самовосприятие", "Эмпатия", "Идентичность", "Привязанность"]} />
      </Group>
      <Group title="Ось V. Психические расстройства">
        <Field label="Симптомы вне сексологии"><Text id="opd_sym" area /></Field>
        <Field label="Предварительный МКБ"><Text id="opd_icd" placeholder="F41.2, F32, F43.2…" /></Field>
      </Group>
      <Group title="Сводка OPD">
        <Text id="opd_sum" area />
        <Field label="Как меняет план секстерапии"><Text id="opd_plan" area /></Field>
      </Group>
      <button className="btn no-print" type="button" onClick={copy}>Копировать OPD</button>
    </>
  );
}
