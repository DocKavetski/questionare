import { useEffect, useState } from "react";
import { Group, Check } from "../ui.jsx";
import { useStore, f } from "../useStore";
import { COMORBID, comorbidCodes } from "../data/clinical.js";

export default function Comorbid() {
  const state = useStore();
  const [tab, setTab] = useState(0);
  const codes = comorbidCodes(state);
  const joined = codes.join(", ");
  useEffect(() => {
    if (joined && state.fields.comorbid_icd !== joined) f("comorbid_icd", joined);
  }, [joined, state.fields.comorbid_icd]);
  const block = COMORBID[tab];
  return (
    <>
      <h1>Депрессия, тревога, ОКР</h1>
      <p className="lede">
        Клинический чек-лист из вашей «Общей системы»: симптомы → ориентир МКБ-10.
        Шкалу Бека сюда не копируем (авторское право) — при необходимости заполняйте бумажный бланк отдельно.
      </p>
      {codes.length ? <div className="result-hero"><h2>{codes.join(" · ")}</h2><p>Клиническое суждение первичнее автошифра.</p></div> : null}
      <div className="sec-nav">
        {COMORBID.map((t, i) => (
          <button key={t.tab} type="button" className={i === tab ? "on" : ""} onClick={() => setTab(i)}>{t.tab}</button>
        ))}
      </div>
      {block.groups.map((g) => (
        <Group key={g.title} title={g.title}>
          {g.ids.map(([id, label]) => (
            <Check key={id} id={"cm:" + id}>{label}</Check>
          ))}
        </Group>
      ))}
      <p className="footer-note">Депрессивный эпизод: ≥2 основных. Суицидальный пункт — сразу в флаги шапки сводки.</p>
    </>
  );
}
