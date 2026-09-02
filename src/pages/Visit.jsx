import { Group, Field, Text, Chips, Scale } from "../ui.jsx";
import { useStore, f, isF } from "../useStore";
import { redFlags } from "../data/clinical.js";
import { scoreTemperament, dcmAxes } from "../data/temperament.js";
import { COME, IV_CTX, visitFocus, hasPartnerOpts, chrOpts, SUI } from "../data/fields.js";
import { cardProgress } from "../data/cardSections.js";

const STEPS = [
  { id: "who", t: "Кто пришёл" },
  { id: "complaint", t: "Жалоба" },
  { id: "function", t: "Функция" },
  { id: "soma", t: "Сома и флаги" },
  { id: "temp", t: "Темперамент" },
  { id: "shot", t: "Снимок" },
];

export default function Visit({ go }) {
  const state = useStore();
  const step = Number(f("_visit_step") || 0);
  const setStep = (n) => f("_visit_step", String(Math.max(0, Math.min(STEPS.length - 1, n))));
  const female = isF();
  const flags = redFlags(state);
  const { firstAvg } = cardProgress(state);

  return (
    <>
      <h1>Быстрый приём</h1>
      <p className="lede">
        Экспресс-режим для первого визита. Ответы попадают в те же поля карты обследования ({firstAvg}% заполнено).
        Полная работа — в разделе «Обзор карты».
      </p>
      <p className="no-print"><button className="btn navy" type="button" onClick={() => go("card")}>Открыть карту</button></p>
      <div className="steps">
        {STEPS.map((s, i) => (
          <button key={s.id} type="button" className={"step-dot" + (i === step ? " on" : "")} onClick={() => setStep(i)} title={s.t} />
        ))}
      </div>
      <p className="step-meta">{step + 1} / {STEPS.length} · {STEPS[step].t} · можно пропустить</p>
      {flags.length ? <div className="flag">⚠ {flags.join(" · ")}</div> : null}

      {step === 0 && <Who female={female} />}
      {step === 1 && <Complaint female={female} />}
      {step === 2 && <Fn female={female} />}
      {step === 3 && <Soma female={female} />}
      {step === 4 && <TempExpress go={go} female={female} />}
      {step === 5 && <Shot go={go} state={state} female={female} />}

      <div className="visit-nav no-print">
        <button className="btn ghost" type="button" onClick={() => setStep(step - 1)} disabled={step === 0}>Назад</button>
        <div className="row">
          {step < STEPS.length - 1 ? (
            <>
              <button className="btn ghost" type="button" onClick={() => setStep(step + 1)}>Пропустить</button>
              <button className="btn" type="button" onClick={() => setStep(step + 1)}>Дальше</button>
            </>
          ) : (
            <button className="btn" type="button" onClick={() => go("summary")}>Протокол</button>
          )}
        </div>
      </div>
    </>
  );
}

function Who({ female }) {
  return (
    <Group title="Кто в кабинете">
      <p className="legend">Пол, возраст и ФИО — в шапке. Здесь — кто пришёл и зачем.</p>
      <Field label="Кто пришёл">
        <Chips prefix="come" opts={COME} />
      </Field>
      <Field label="Мотивация к изменению 0–10"><Text id="mot" cls="mini" /></Field>
      <Field label="Уверенность 0–10"><Text id="conf" cls="mini" /></Field>
      <Field label="Постоянный партнёр">
        <Chips prefix="has_p" opts={hasPartnerOpts(female)} />
      </Field>
    </Group>
  );
}

function Complaint({ female }) {
  return (
    <>
      <Group title="Одной фразой">
        <Field label="Жалоба" hint="его/её словами">
          <Text id="complaint" area placeholder="Что не так с сексом / парой / телом" />
        </Field>
        <Field label="Фокус визита">
          <Chips prefix="visit_prob" opts={visitFocus(female)} />
        </Field>
        <Field label="Длительность, мес."><Text id="dur_mo" cls="mini" /></Field>
        <Field label="Контекст">
          <Chips prefix="iv_ctx" opts={IV_CTX} />
        </Field>
        <Field label="Последний коитус"><Text id="last_coitus" area placeholder="когда, что получилось, реакция пары" /></Field>
        <Field label="Цель визита"><Text id="goal" area placeholder="что будет «достаточно хорошо»" /></Field>
      </Group>
    </>
  );
}

function Fn({ female }) {
  if (female) {
    return (
      <>
        <Group title="Любрикация и пенетрация">
          <p className="legend">Только то, что прозвучало. Остальное — в полной карте.</p>
          <Field label="Любрикация во время ласк">
            <Chips prefix="lub_fore" opts={["высокая", "умеренная", "низкая", "отсутствует"]} />
          </Field>
          <Field label="Во время коитуса">
            <Chips prefix="lub_coitus" opts={["усиливается", "снижается", "исчезает", "отсутствует"]} />
          </Field>
          <Field label="Пенетрация">
            <Chips prefix="pen_f" opts={["удаётся свободно", "затруднена", "не удаётся"]} />
          </Field>
          <Field label="Из-за">
            <Chips prefix="pen_why" opts={["боль", "недостаточное расслабление", "судорожный спазм мышц"]} />
          </Field>
        </Group>
        <Group title="Оргазм">
          <Field label="% оргастичности"><Text id="org_pct" cls="mini" /></Field>
          <Field label="Удовлетворение 0–10"><Text id="sat" cls="mini" /></Field>
        </Group>
      </>
    );
  }
  return (
    <>
      <Group title="Эрекция">
        <p className="legend">Ситуационная потеря при пенетрации — частый психогенный флаг.</p>
        <Field label="При коитусе">
          <Chips prefix="erect_coitus" opts={["быстрой возбудимости", "средней", "медленной", "полные", "неполные", "неполные ослабленные", "отсутствуют"]} />
        </Field>
        <Field label="Ослабевают / исчезают">
          <Chips prefix="erect_gone" opts={["при обнажении", "при надевании презерватива", "при попытке совершить пенетрацию", "во время первых фрикций", "в процессе фрикций", "в непривычной обстановке"]} />
        </Field>
      </Group>
      <Group title="Эякуляция и оргазм">
        <Field label="Когда">
          <Chips prefix="ejac_when" opts={["до пенетрации", "в момент пенетрации", "после начала фрикций", "отсутствует", "оргазм без эякуляции"]} />
        </Field>
        <Field label="Через"><Text id="ejac_sec" placeholder="сек / мин / число фрикций" /></Field>
        <Field label="% оргастичности"><Text id="org_pct" cls="mini" /></Field>
      </Group>
    </>
  );
}

function Soma({ female }) {
  return (
    <>
      <div className="flag">
        Антидепрессанты (особенно СИОЗС) часто снижают либидо и отсрочивают оргазм{female ? "" : " и ослабляют эрекцию"}.
        Не снимать препарат самостоятельно.{female ? " У женщин учитывать КОК." : ""}
      </div>
      <Group title="Лекарства и соматика">
        <Field label="Лекарства"><Text id="meds" area placeholder="препарат, доза, с какого времени" /></Field>
        <Field label="Хронические">
          <Chips prefix="chr" opts={chrOpts(female)} />
        </Field>
        <Field label="Алкоголь / ПАВ"><Text id="substances" area /></Field>
      </Group>
      <Group title="Суицидальный риск">
        <Chips prefix="sui" opts={SUI} />
        <Text id="sui_note" area placeholder="если есть — подробно" />
      </Group>
    </>
  );
}

function TempExpress({ go, female }) {
  const state = useStore();
  const answers = {};
  const qs = female ? ["f_q1", "f_q2", "f_q3", "f_q4", "f_q5", "f_q6", "f_q7", "f_q8", "f_q9", "f_q10", "f_q11", "f_q12", "f_q13"]
    : ["m_q1", "m_q2", "m_q3", "m_q4", "m_q5", "m_q6", "m_q7", "m_q8", "m_q9", "m_q10", "m_q11", "m_q12", "m_q13"];
  qs.forEach((id) => { if (state.fields[id]) answers[id] = state.fields[id]; });
  const scored = Object.keys(answers).length >= 4 ? scoreTemperament(female ? "f" : "m", answers) : null;
  const express = ["tmp0", "tmp1", "tmp2", "tmp3"].map((id) => Number(state.fields[id]));
  const expressOk = express.every((n) => n > 0);

  return (
    <>
      <Group title="Экспресс: четыре оси 1–4">
        <p className="legend">Если нет времени на 13 пунктов — поставьте клиническую оценку. Dual Control (Bancroft): возбуждение vs торможение неудачи и последствий — без копирования чужих пунктов.</p>
        <Field label="Биологическая база"><Scale id="tmp0" /></Field>
        <Field label="Драйв / возбуждение"><Scale id="tmp1" /></Field>
        <Field label="Торможение (помехи)"><Scale id="tmp2" /></Field>
        <Field label="Абстиненция"><Scale id="tmp3" /></Field>
        {expressOk ? <ExpressRead b={express} female={female} /> : <p className="legend">Отметьте 1–4 по каждому блоку — или откройте полный бланк.</p>}
      </Group>
      <Group title="Dual Control (клинически)">
        {dcmAxes.map((ax) => (
          <Field key={ax.id} label={ax.title} hint={ax.hint}><Scale id={ax.id} /></Field>
        ))}
      </Group>
      {scored ? (
        <div className="result-hero">
          <h2>{scored.typeName}</h2>
          <p>{scored.typeDesc}</p>
        </div>
      ) : null}
      <p className="row no-print">
        <button className="btn navy" type="button" onClick={() => go("temp")}>Полный темперамент (13 пунктов)</button>
      </p>
    </>
  );
}

function ExpressRead({ b, female }) {
  const [b1, b2, b3] = b;
  let name = "Смешанный профиль";
  let desc = "Сверьте с конституцией бланка и жалобой.";
  if (b1 >= 4 && b2 >= 3 && b3 <= 2) {
    name = female ? "Огненный темперамент" : "Высокий драйв, низкое торможение";
    desc = "Разрядка скорее гигиена. Реже невроз «из-за секса».";
  } else if (b2 >= 3 && b3 >= 3) {
    name = "Конфликтный: драйв + торможение";
    desc = "Хочет, но стыд, контроль или обстановка гасят. Частая мишень секстерапии. Dual Control: высокий SES при высоком SIS1.";
  } else if (b1 <= 2 && b3 >= 3) {
    name = "Чувствительный / тормозимый";
    desc = "Не стыдить за «слабое либидо». Сначала безопасность и контекст.";
  } else if (b1 <= 2 && b2 <= 2) {
    name = "Рецептивный тип";
    desc = "Нужны время и атмосфера. Не путать с дисфункцией.";
  }
  return (
    <div className="result-hero">
      <h2>{name}</h2>
      <p>База {b[0]}, драйв {b[1]}, торможение {b[2]}, абстиненция {b[3]}. {desc}</p>
    </div>
  );
}

function Shot({ go, state, female }) {
  const fv = (id) => state.fields[id] || "";
  const focus = visitFocus(female).filter((o) => state.checks["visit_prob:" + o]);
  return (
    <>
      <div className="result-hero">
        <h2>Что уже есть в карте</h2>
        <p>
          {state.patient.name || "без ФИО"}, {state.patient.age || "?"} лет.
          {fv("complaint") ? ` Жалоба: ${fv("complaint")}.` : " Жалоба ещё не записана."}
          {focus.length ? ` Фокус: ${focus.join(", ")}.` : ""}
        </p>
      </div>
      <Group title="Дополнить, если успеете">
        <Field label="Предварительный диагноз"><Text id="predx" area placeholder="шифр МКБ, своими словами" /></Field>
        <Field label="План на сегодня"><Text id="plan_sex" area placeholder="секстерапия / пара / раздатка" /></Field>
      </Group>
      <div className="grid cards">
        <div className="card click" onClick={() => go("card/struct")}><span className="tag">МКБ</span><h3>Структура и диагноз</h3><p>Коды, оси, заключение.</p></div>
        <div className="card click" onClick={() => go("card/partner")}><span className="tag">пара</span><h3>Раздел «Пара»</h3><p>Отношения и условия коитуса.</p></div>
        <div className="card click" onClick={() => go("handouts")}><span className="tag">домой</span><h3>Раздатка</h3><p>Фокусирование, ПЭ, АД.</p></div>
        <div className="card click" onClick={() => go("summary")}><span className="tag">протокол</span><h3>Скопировать протокол</h3><p>В амбулаторную карту.</p></div>
      </div>
    </>
  );
}
