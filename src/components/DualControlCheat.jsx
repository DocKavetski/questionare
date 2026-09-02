import { useState } from "react";
import { useStore, f } from "../store/useStore.js";

const AXES = [
  {
    id: "dcm_ses",
    code: "SES",
    title: "Возбуждение / драйв",
    plain: "Насколько легко и сильно включается на эротические сигналы (фантазия, касание, новизна).",
    high: "Много триггеров, легко «заводится». Не патология сама по себе.",
    low: "Мало «зацепок», нужен долгий разогрев / особый контекст. Не путать сразу с «нет желания».",
  },
  {
    id: "dcm_sis1",
    code: "SIS1",
    title: "Тормоз неудачи",
    plain: "Гашение из‑за страха «не справлюсь»: эрекция, оргазм, оценка себя, внутренний наблюдатель.",
    high: "Ситуационная ЭД/срыв при пенетрации, ПЭ на панике, избегание инициативы. Часто ось психическая ведущая.",
    low: "Мало performance-тревоги — смотреть органику, контекст, SIS2 или пару.",
  },
  {
    id: "dcm_sis2",
    code: "SIS2",
    title: "Тормоз последствий",
    plain: "Гашение из‑за угрозы снаружи: беременность, ИППП, «нас услышат», стыд, вина, травма.",
    high: "В фантазии/соло есть, в небезопасном месте или с «не тем» партнёром — нет. Работать с условиями и безопасностью.",
    low: "Слабо чувствителен к внешним угрозам — при высоком SES учитывать риск/импульс.",
  },
];

function readProfile(ses, sis1, sis2) {
  if (!ses && !sis1 && !sis2) return null;
  const tips = [];
  if (ses >= 3 && sis1 >= 3) {
    tips.push({
      title: "Конфликтный: хочет, но срывается",
      text: "Высокий SES + высокий SIS1. Частая мишень секстерапии: снизить ставку на результат, sensate focus, работа с наблюдателем.",
    });
  }
  if (sis1 >= 3 && ses <= 2) {
    tips.push({
      title: "Тормозимый / чувствительный",
      text: "Слабый драйв и сильный тормоз неудачи. Не стыдить за «слабое либидо». Сначала безопасность и снятие контроля.",
    });
  }
  if (sis2 >= 3) {
    tips.push({
      title: "Контекст и последствия",
      text: "Высокий SIS2 → условия коитуса, контрацепция/безопасность, стыд, травма. Не лечить только «усилением стимула».",
    });
  }
  if (ses >= 3 && sis1 <= 2 && sis2 <= 2) {
    tips.push({
      title: "Высокий драйв, низкое торможение",
      text: "Легко включается. В паре — проверить расхождение желания и импульс; дисфункция не из этого профиля сама по себе.",
    });
  }
  if (ses <= 2 && sis1 <= 2 && sis2 <= 2 && (ses || sis1 || sis2)) {
    tips.push({
      title: "Низкий профиль по всем осям",
      text: "Уточнить усталость, АД, депрессию, соматику. Dual Control здесь может быть не ведущим механизмом.",
    });
  }
  if (!tips.length && (ses || sis1 || sis2)) {
    tips.push({
      title: "Смешанный профиль",
      text: "Сверьте с жалобой и осями структуры. Цифры — гипотеза, не диагноз.",
    });
  }
  return tips;
}

export default function DualControlCheat() {
  useStore();
  const [open, setOpen] = useState(true);
  const ses = Number(f("dcm_ses")) || 0;
  const sis1 = Number(f("dcm_sis1")) || 0;
  const sis2 = Number(f("dcm_sis2")) || 0;
  const tips = readProfile(ses, sis1, sis2);

  return (
    <div className="dcm-cheat no-print">
      <button type="button" className="dcm-cheat-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>Шпаргалка Dual Control</span>
        <span className="dcm-cheat-arrow">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="dcm-cheat-body rise">
          <p className="dcm-lead">
            Bancroft / Janssen: возбуждение = баланс <b>газа (SES)</b> и <b>двух тормозов</b> — страх неудачи (SIS1) и страх последствий (SIS2).
            Оценка 1–4 — ваша клиническая гипотеза, не сумма опросника.
          </p>

          <div className="dcm-axes">
            {AXES.map((ax) => {
              const val = Number(f(ax.id)) || 0;
              return (
                <article key={ax.id} className={"dcm-axis" + (val >= 3 ? " hot" : "")}>
                  <header>
                    <span className="dcm-code">{ax.code}</span>
                    <strong>{ax.title}</strong>
                    {val ? <span className="dcm-val">{val}</span> : null}
                  </header>
                  <p>{ax.plain}</p>
                  <ul>
                    <li><span>↑</span> {ax.high}</li>
                    <li><span>↓</span> {ax.low}</li>
                  </ul>
                </article>
              );
            })}
          </div>

          {tips ? (
            <div className="dcm-tips">
              <h4>По текущим оценкам</h4>
              {tips.map((t) => (
                <div key={t.title} className="dcm-tip">
                  <strong>{t.title}</strong>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="hint">Отметьте SES / SIS1 / SIS2 — появится разбор профиля.</p>
          )}

          <div className="dcm-map">
            <h4>Куда смотреть дальше</h4>
            <ul>
              <li><b>SIS1 ↑</b> → блок тревоги ожидания, эрекция/оргазм, ось психическая в «Структуре»</li>
              <li><b>SIS2 ↑</b> → условия, пара, травма/стыд, безопасность</li>
              <li><b>SES ↓</b> → лекарства (АД), сон, депрессия, конституция / нейрогуморальная ось</li>
              <li><b>SES ↑ + SIS1 ↑</b> → план: секстерапия / пара, не только PDE5</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
