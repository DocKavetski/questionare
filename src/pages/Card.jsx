import { Group, Field, Text, Chips, Check } from "../ui.jsx";
import { useStore, f, isF } from "../useStore";
import { EZ_M, EZ_F, EZ_SCORE, EZ_DP, sexDx, structAxes, redFlags } from "../data/clinical.js";

const SECS = [
  ["pass", "Паспорт"],
  ["problem", "Жалобы"],
  ["function", "Функция"],
  ["history", "Анамнез"],
  ["soma", "Сома"],
  ["partner", "Пара"],
  ["ez", "ЭЗ"],
  ["exam", "Осмотр"],
  ["struct", "МКБ"],
  ["plan", "План"],
];

export default function Card({ extra, go }) {
  const state = useStore();
  const female = isF();
  const sec = extra && SECS.some(([id]) => id === extra) ? extra : "pass";
  const flags = redFlags(state);
  const setSec = (id) => go("card/" + id);

  return (
    <>
      <h1>Карта обследования</h1>
      <p className="lede">
        Бланк {female ? "женского" : "мужского"} пола от 21.10.2024. Принцип: только необходимое для диагноза, без ятрогении.
        {female ? " Три составляющие цикла." : " Четыре составляющие цикла."}
      </p>
      {flags.length ? <div className="flag">⚠ {flags.join(" · ")}</div> : null}
      <div className="sec-nav no-print">
        {SECS.map(([id, t]) => (
          <button key={id} type="button" className={sec === id ? "on" : ""} onClick={() => setSec(id)}>{t}</button>
        ))}
      </div>
      {sec === "pass" && <Pass female={female} />}
      {sec === "problem" && <Problem />}
      {sec === "function" && <FunctionBlock female={female} />}
      {sec === "history" && <History female={female} />}
      {sec === "soma" && <Soma female={female} go={go} />}
      {sec === "partner" && <Partner female={female} />}
      {sec === "ez" && <Ez female={female} />}
      {sec === "exam" && <Exam female={female} />}
      {sec === "struct" && <Struct female={female} go={go} />}
      {sec === "plan" && <Plan female={female} go={go} />}
    </>
  );
}

function Pass({ female }) {
  return (
    <>
      <Group title="Карта">
        <p className="legend">Номер и дата заведения — в шапке.</p>
        <Field label="Дата окончания карты"><input type="date" value={f("date_end")} onChange={(e) => f("date_end", e.target.value)} /></Field>
      </Group>
      <Group title="Социальное">
        <Field label="Гражданство"><Text id="citizen" placeholder="Республика Беларусь" /></Field>
        <Field label="Национальность"><Text id="nation" /></Field>
        <Field label="Вероисповедание">
          <Chips prefix="rel" opts={["атеизм", "агностицизм", "православие", "католичество", "протестантизм", "ислам", "иудаизм", "буддизм", "индуизм", "другое"]} />
          <Text id="rel_o" placeholder="уточнение" />
        </Field>
        <Field label="Образование">
          <Chips prefix="edu" opts={["начальное", "базовое", "среднее", "среднее специальное", "профессионально-техническое", "высшее (неоконченное)", "послевузовское"]} />
        </Field>
        <Field label="Образовательный индекс"><Text id="oi" cls="mini" /></Field>
        <Field label="Семейное положение">
          <Chips prefix="mar" opts={female
            ? ["замужем", "не замужем", "вдова", "разведена", "разошлась", "незарегистрированный брак"]
            : ["женат", "не женат", "вдовец", "разведен", "разошелся", "незарегистрированный брак"]} />
          <Text id="mar_n" placeholder="сколько раз / уточнение" />
        </Field>
        <Field label="Работа, должность"><Text id="job" area /></Field>
        <Field label="Место жительства"><Text id="addr" area /></Field>
      </Group>
      <Group title="Обстоятельства обращения">
        <Field label="Как обратился">
          <Chips prefix="come" opts={["самостоятельно", "совместно с партнёром", "по направлению", "под давлением"]} />
        </Field>
        <Field label="Направление / источник"><Text id="come_src" /></Field>
        <Field label="Мотивация 0–10"><Text id="mot" cls="mini" /></Field>
        <Field label="Уверенность 0–10"><Text id="conf" cls="mini" /></Field>
      </Group>
    </>
  );
}

function Problem() {
  return (
    <>
      <Group title="Жалобы">
        <p className="legend">Партнёрские, сексуальные, эмоциональные, поведенческие и соматические.</p>
        <Text id="complaint" area />
      </Group>
      <Group title="Исследование сексуальной проблемы">
        <p className="legend">Первая мысль / первый неудачный коитус, реакция каждого, динамика, ранее лечение.</p>
        <Text id="problem" area />
        <Field label="Последний коитус"><Text id="last_coitus" area placeholder="когда, что получилось, реакция пары" /></Field>
      </Group>
      <Group title="Способы решения до обращения"><Text id="tried" area /></Group>
      <Group title="Цель / образ будущего"><Text id="goal" area /></Group>
      <Group title="Сексуальное удовлетворение">
        <Field label="0–10 (при постоянном партнёре)"><Text id="sat" cls="mini" /></Field>
      </Group>
    </>
  );
}

function FunctionBlock({ female }) {
  if (female) {
    return (
      <>
        <Group title="Влечение и инициатива">
          <Field label="Инициатива сближения">
            <div className="mini-row">до брака <Text id="init_pre" cls="mini" /> в браке <Text id="init_mar" cls="mini" /> сейчас <Text id="init_now" cls="mini" /> % коитуса <Text id="init_pct" cls="mini" /></div>
          </Field>
          <Field label="Реакция партнёра"><Chips prefix="init_react" opts={["не приветствует", "безразличен"]} /></Field>
          <Field label="Активность">
            <Chips prefix="act_fore" opts={["ласки: активна", "ласки: пассивна"]} />
            <Chips prefix="act_coitus" opts={["коитус: активна", "коитус: пассивна"]} />
          </Field>
          <Field label="Избегание коитуса">
            <Text id="avoid" />
            <Chips prefix="avoid_react" opts={["партнёр не приветствует", "безразличен"]} />
          </Field>
          <Field label="Частота коитуса">
            <Text id="coitus_n" />
            <Chips prefix="coitus_u" opts={["нед.", "мес.", "год"]} />
            эксцессы до <Text id="excess" cls="mini" />
          </Field>
          <Field label="Абстиненция">
            до <Text id="abst" cls="mini" />
            <Chips prefix="abst_u" opts={["дней", "нед.", "мес."]} />
            <Chips prefix="abst_type" opts={["тотальный", "парциальный"]} />
            <Chips prefix="abst_part" opts={["ночные спонтанные оргазмы", "дневные спонтанные оргазмы", "мастурбация", "петтинг"]} />
          </Field>
          <Field label="Переносимость">
            <Chips prefix="abst_feel" opts={["облегчение и подъём настроения", "на настроении не сказывается", "умеренный дискомфорт, фиксация мыслей", "не выдерживает, прибегает к мастурбации"]} />
          </Field>
        </Group>
        <Group title="Коитальные ощущения">
          <Chips prefix="fric_feel" opts={["запредельные (экстатические)", "сильные, яркие", "приятные", "слабоприятные", "нейтральные", "неприятные", "болезненные"]} />
          <Chips prefix="fric_time" opts={["эпизодически", "постоянно", "при неглубоком проникновении", "при глубоком проникновении"]} />
          <Field label="Длительность фрикций">
            <Text id="fric_from" /> — <Text id="fric_to" />
            <Chips prefix="fric_len" opts={["нормальная", "укорочение", "затяжной период"]} />
          </Field>
        </Group>
        <Group title="Оргазм">
          <Field label="% оргастичности"><Text id="org_pct" cls="mini" /> макс. <Text id="org_max" cls="mini" /> в <Text id="org_max_age" cls="mini" /> лет</Field>
          <Field label="Коитус без оргазма"><Chips prefix="org_wo" opts={["приятен", "безразличен", "тягостен"]} /></Field>
          <Field label="Имитация"><Chips prefix="org_fake" opts={["часто", "иногда", "редко"]} /><Text id="org_fake_why" placeholder="мотив" /></Field>
          <Field label="Через после пенетрации"><Text id="org_after" /></Field>
          <Field label="Нормативно-коитальный">
            <Chips prefix="org_norm" opts={["полный двухфазный", "сильный", "умеренный", "слабый (гипооргазмия, ангедония)", "оргазмоподобный / однофазный", "вагинальный", "клиторно-вагинальный", "клиторный", "неопределённой локализации", "протяженный / волнообразный", "множественный", "однократный", "сухой", "мокрый (струйный)", "болезненный"]} />
          </Field>
          <Field label="Облегчается"><Chips prefix="org_easy" opts={["начало цикла", "середина", "конец", "менструация", "переутомление", "опьянение", "непривычная обстановка", "незапланированный коитус", "другой партнёр"]} /></Field>
          <Field label="Затрудняется"><Chips prefix="org_hard" opts={["начало цикла", "середина", "конец", "менструация", "переутомление", "опьянение", "непривычная обстановка", "незапланированный коитус", "другой партнёр"]} /></Field>
          <Field label="Другие"><Chips prefix="org_other" opts={["паракоитальный (сценарии)", "петтинг клиторный", "петтинг вагинальный неадекватный", "мастурбаторный адекватный", "мастурбаторный неадекватный", "спонтанный дневной", "спонтанный ночной"]} /></Field>
          <Field label="Триггеры"><Text id="org_trig" area /></Field>
        </Group>
        <Group title="Возбуждение и любрикация">
          <Field label="Уровень возбуждения">
            <Chips prefix="ar_start" opts={["начало: вегетативно-сосудистый", "моторно-речевой", "поведенческий", "психический"]} />
            <Chips prefix="ar_mid" opts={["процесс: вегетативно-сосудистый", "моторно-речевой", "поведенческий", "психический"]} />
            <Chips prefix="ar_end" opts={["конец: вегетативно-сосудистый", "моторно-речевой", "поведенческий", "психический"]} />
          </Field>
          <Field label="Любрикация вне коитуса">
            <Chips prefix="lub_out" opts={["высокая", "умеренная", "низкая", "отсутствует"]} />
            <Chips prefix="lub_out_how" opts={["быстро", "медленно"]} />
          </Field>
          <Field label="Возникает при"><Chips prefix="lub_when" opts={["фантазии", "порно", "мастурбация", "флирт", "танец", "петтинг", "другой партнёр"]} /></Field>
          <Field label="Во время ласк">
            <Chips prefix="lub_fore" opts={["высокая", "умеренная", "низкая", "отсутствует"]} />
            <Chips prefix="lub_fore_how" opts={["быстро", "медленно"]} />
          </Field>
          <Field label="Во время коитуса"><Chips prefix="lub_coitus" opts={["усиливается", "снижается", "исчезает", "отсутствует"]} /></Field>
        </Group>
        <Group title="Пенетрация">
          <Chips prefix="pen_f" opts={["удаётся свободно", "затруднена", "не удаётся"]} />
          <Field label="Из-за"><Chips prefix="pen_why" opts={["боль", "недостаточное расслабление", "судорожный спазм мышц"]} /></Field>
          <Field label="Ощущение"><Chips prefix="pen_feel" opts={["резко возбуждает", "очень приятно и возбуждает", "приятно, но не возбуждает", "безразлично", "неприятно", "противно", "очень противно"]} /></Field>
        </Group>
      </>
    );
  }
  return (
    <>
      <Group title="Половое влечение">
        <Field label="Настоятельное желание коитуса"><Text id="desire_n" /><Chips prefix="desire_u" opts={["нед.", "мес.", "год"]} /></Field>
        <Field label="Попытки с партнёршей">
          <Text id="try_p" />
          <Chips prefix="try_p_how" opts={["без внутреннего побуждения", "только в угоду партнёрше", "спонтанные эрекции", "адекватные эрекции"]} />
        </Field>
        <Field label="Частота коитуса"><Text id="coitus_n" /><Chips prefix="coitus_u" opts={["нед.", "мес.", "год"]} /> эксцессы до <Text id="excess" cls="mini" /></Field>
        <Field label="Абстиненция">
          до <Text id="abst" cls="mini" />
          <Chips prefix="abst_u" opts={["дней", "нед.", "мес."]} />
          <Chips prefix="abst_type" opts={["тотальный", "парциальный"]} />
          <Chips prefix="abst_part" opts={["ночные поллюции", "дневные поллюции", "мастурбация", "петтинг"]} />
        </Field>
        <Field label="Переносимость"><Chips prefix="abst_feel" opts={["облегчение и подъём настроения", "на настроении не сказывается", "умеренный дискомфорт, фиксация мыслей", "не выдерживает, прибегает к мастурбации"]} /></Field>
      </Group>
      <Group title="Коитальные ощущения">
        <Chips prefix="fric_feel" opts={["сильные, яркие", "приятные", "слабоприятные", "нейтральные", "неприятные", "болезненные"]} />
        <Chips prefix="fric_time" opts={["эпизодически", "постоянно"]} />
      </Group>
      <Group title="Оргазм">
        <Field label="% оргастичности"><Text id="org_pct" cls="mini" /> макс. <Text id="org_max" cls="mini" /> в <Text id="org_max_age" cls="mini" /> лет</Field>
        <Field label="Имитация"><Chips prefix="org_fake" opts={["часто", "иногда", "редко"]} /></Field>
        <Field label="Нормативно-коитальный"><Chips prefix="org_norm" opts={["полный двухфазный", "сильный", "умеренный", "слабый (гипооргазмия, ангедония)", "оргазмоподобный / однофазный", "протяженный", "множественный", "однократный"]} /></Field>
        <Field label="Другие"><Chips prefix="org_other" opts={["паракоитальный (реальные триггеры)", "паракоитальный (воображаемые)", "петтинговый", "мастурбаторный адекватный", "мастурбаторный неадекватный", "спонтанный дневной", "спонтанный ночной"]} /></Field>
      </Group>
      <Group title="Эрекции при коитусе">
        <Chips prefix="erect_coitus" opts={["быстрой возбудимости", "средней", "медленной", "полные", "неполные", "неполные ослабленные", "отсутствуют"]} />
        <Field label="Отсутствуют в течение"><Text id="erect_none" /></Field>
        <Field label="Возникают"><Chips prefix="erect_on" opts={["при виде и прикосновении", "во время взаимных ласк", "при оральной стимуляции партнёршей", "при мануальной", "при инструментальной", "при самостимуляции"]} /></Field>
        <Field label="Ослабевают / исчезают"><Chips prefix="erect_gone" opts={["при обнажении", "во время ласк", "после прекращения стимуляции", "при надевании презерватива", "при попытке совершить пенетрацию", "во время первых фрикций", "в процессе фрикций", "в фазе плато", "при смене позиции", "при конкурирующих представлениях", "в опьянении", "при переутомлении", "в непривычной обстановке"]} /></Field>
        <Field label="Усиливаются"><Chips prefix="erect_up" opts={["при обнажении", "при самостимуляции", "при стимуляции партнёршей", "после пенетрации", "в процессе фрикций", "при малой активности", "после отдыха в половых путях", "женщина сверху", "на боку", "замещающие фантазии", "спонтанный коитус", "опьянение"]} /></Field>
        <Field label="Пенетрация"><Chips prefix="pen" opts={["удаётся свободно", "затруднена часто", "затруднена иногда", "не удаётся часто", "не удаётся иногда"]} /></Field>
      </Group>
      <Group title="Спонтанные эрекции и мастурбация">
        <Chips prefix="erect_sp" opts={["резко повышенные", "повышенные", "полные", "неполные", "ослабленные", "отсутствуют"]} />
        <Field label="Диссоциация"><Chips prefix="dissoc" opts={["отсутствует", "прямая", "обратная"]} /></Field>
        <Field label="При мастурбации"><Chips prefix="erect_mast" opts={["быстрой возбудимости", "средней", "медленной", "полные", "неполные", "ослабленные", "отсутствуют"]} /></Field>
      </Group>
      <Group title="Эякуляция">
        <Chips prefix="ejac_when" opts={["болезненная", "до пенетрации", "в момент пенетрации", "после начала фрикций", "отсутствует", "оргазм без эякуляции"]} />
        <Field label="Через"><Text id="ejac_sec" placeholder="сек / мин / число фрикций" /></Field>
        <Field label="Пролонгация"><Chips prefix="prolong" opts={["банальная", "истинная", "контроль не актуален"]} /></Field>
        <Field label="Закон силовых отношений"><Chips prefix="force_law" opts={["сохранён", "утрата зависимости от абстиненции / опьянения / эксцессов"]} /></Field>
        <Field label="Рефрактерный период"><Text id="refract" placeholder="сейчас" /> раньше: <Text id="refract_was" /></Field>
        <Field label="Дневные поллюции"><Chips prefix="day_poll" opts={["адекватные", "неадекватные", "без оргазма", "без эрекции", "оргазм без эякуляции"]} /><Text id="day_poll_n" placeholder="частота / последняя" /></Field>
        <Field label="Триггеры"><Text id="ejac_trig" area /></Field>
        <Field label="Атоническая сперматорея"><Text id="spermatorrhea" /></Field>
      </Group>
    </>
  );
}

function History({ female }) {
  if (female) {
    return (
      <>
        <Group title="Пубертат">
          <Field label="Осознание половой принадлежности, лет"><Text id="id_age" cls="mini" /></Field>
          <Field label="Сексуальные игры">
            <Chips prefix="games" opts={["в доктора", "в папу-маму", "имитация коитуса"]} />
            <Text id="games_o" />
            <Chips prefix="games_role" opts={["пассивно вовлечена", "активный организатор", "затрудняется"]} />
          </Field>
          <Field label="Полоролевое поведение"><Chips prefix="gender_role" opts={["гиперфемининное", "фемининная акцентуация", "фемининное", "кроссполовая акцентуация", "трансформация"]} /></Field>
          <Field label="Рост груди с, лет"><Text id="breast_age" cls="mini" /></Field>
          <Field label="Менархе, лет"><Text id="menarche" cls="mini" /><Chips prefix="menses_set" opts={["установились сразу", "через месяцы/годы"]} /></Field>
          <Field label="Цикл сейчас"><Text id="cycle" /><Chips prefix="cycle_q" opts={["регулярные", "нерегулярные", "обильные", "умеренные", "скудные", "безболезненные", "болезненные"]} /></Field>
          <Field label="Последняя менструация"><Text id="last_menses" /></Field>
          <Field label="Предменструальный период"><Chips prefix="pms" opts={["настроение", "раздражительность", "слезливость", "влечение ↑", "нагрубание молочных желёз", "боли внизу живота"]} /></Field>
          <Field label="Отношение к пубертату"><Chips prefix="pub_att" opts={["гордость", "радость", "удивление", "безразличие", "дискомфорт", "неприятие"]} /></Field>
          <Field label="Пробуждение / реализация, лет">платоническое <Text id="aw_pl" cls="mini" /> / <Text id="aw_pl_r" cls="mini" /> · эротическое <Text id="aw_er" cls="mini" /> / <Text id="aw_er_r" cls="mini" /></Field>
        </Group>
        <Group title="Мастурбация и первый оргазм">
          <Field label="С, лет / оргазм с"><Text id="mast_from" cls="mini" /> / <Text id="mast_org" cls="mini" /></Field>
          <Chips prefix="mast_with" opts={["с фантазиями", "с порно"]} />
          <Field label="Клинический тип"><Chips prefix="mast_type" opts={["детская доэротическая", "ранняя допубертатная", "фрустрационная", "подражательная", "персевераторно-обсессивная", "подростковая", "заместительная"]} /></Field>
          <Field label="Отношение"><Chips prefix="mast_att" opts={["безопасна / полезна", "опасна / вред", "неприемлема", "стыд, вина, беспокойство"]} /></Field>
          <Field label="Прекратила"><Text id="mast_stop" /></Field>
          <Field label="Первый оргазм, лет"><Text id="first_org" cls="mini" /><Chips prefix="first_org_how" opts={["спонтанный ночной", "спонтанный дневной", "мастурбация", "петтинг", "коитус"]} /></Field>
          <Field label="Эротические сновидения с"><Text id="er_dream" cls="mini" /><Chips prefix="noct_dream" opts={["романтический", "эротический", "сексуальный", "девиантный", "тревожный", "стрессовый"]} /></Field>
        </Group>
        <Group title="Первый коитус и ритм">
          <Field label="Первый коитус, лет"><Text id="first_coitus" cls="mini" /><Chips prefix="first_coitus_w" opts={["без предварительного опыта", "с опытом", "до брака", "после брака"]} /></Field>
          <Chips prefix="first_coitus_init" opts={["обоюдное желание", "своя инициатива", "инициатива партнёра", "принуждение"]} />
          <Chips prefix="first_coitus_alc" opts={["трезвая", "алкоголь лёгкий", "алкоголь сильный", "наркотик"]} />
          <Chips prefix="first_coitus_ok" opts={["удался", "не удался по своей вине", "по вине партнёра", "внешние причины"]} />
          <Field label="Дефлорация"><Chips prefix="defl" opts={["не требовалась", "не удалась", "удалась", "безболезненная", "болезненная"]} /></Field>
          <Field label="Связи до текущего партнёра"><Text id="pre_rel" area /></Field>
          <Field label="Ритм в 1-й год"><Text id="ufr_y1" /></Field>
          <Field label="УФР"><Chips prefix="ufr_how" opts={["сразу", "через месяцы/годы"]} /><Text id="ufr_when" /></Field>
          <Field label="Ритм за год до проблемы"><Text id="ufr_pre" /></Field>
          <Field label="Внебрачные связи"><Text id="extra" area /><Chips prefix="extra_why" opts={["любопытство", "самоутверждение", "новизна", "неудовлетворённость", "избирательная дисфункция к партнёру", "месть", "сострадание", "новая любовь", "особые предпочтения"]} /></Field>
        </Group>
        <Group title="Репродукция, контрацепция, климакс">
          <Field label="Беременности">всего <Text id="preg" cls="mini" /> родов <Text id="birth" cls="mini" /> абортов <Text id="abort" cls="mini" /> выкидышей <Text id="miscar" cls="mini" /></Field>
          <Field label="Патология"><Text id="preg_path" area /></Field>
          <Field label="Дети"><Text id="kids" area /></Field>
          <Field label="Контрацепция"><Chips prefix="contr" opts={["прерванный коитус", "презерватив", "календарный", "ВМС", "гормональные", "спринцевание", "другое"]} /></Field>
          <Field label="Влияние"><Chips prefix="contr_fx" opts={["желание ↓", "желание ↑", "возбуждение ↓", "возбуждение ↑", "оргазм ↓", "оргазм ↑"]} /></Field>
          <Field label="Климакс"><Text id="clim_age" cls="mini" /><Text id="clim" area /></Field>
          <Field label="Половая инволюция"><Chips prefix="invol" opts={["приятие", "безразличие", "душевный дискомфорт", "неприятие"]} /><Text id="invol_n" area /></Field>
        </Group>
      </>
    );
  }
  return (
    <>
      <Group title="Пубертат и влечение">
        <Field label="Осознание половой принадлежности, лет"><Text id="id_age" cls="mini" /></Field>
        <Field label="Сексуальные игры">
          <Chips prefix="games" opts={["в доктора", "в папу-маму", "имитация коитуса"]} />
          <Text id="games_o" />
          <Chips prefix="games_role" opts={["пассивно вовлечён", "активный организатор", "затрудняется"]} />
        </Field>
        <Field label="Полоролевое поведение"><Chips prefix="gender_role" opts={["гипермаскулинное", "маскулинная акцентуация", "маскулинное", "кроссполовая акцентуация", "трансформация"]} /></Field>
        <Field label="Первая эякуляция, лет"><Text id="first_ejac" cls="mini" /><Chips prefix="first_ejac_how" opts={["ночная поллюция", "дневная поллюция", "мастурбация", "петтинг", "коитус"]} /></Field>
        <Field label="Ночные поллюции с"><Text id="noct" cls="mini" /><Chips prefix="noct_dream" opts={["романтический", "эротический", "сексуальный", "девиантный", "тревожный", "стрессовый"]} /></Field>
        <Field label="Отношение к пубертату"><Chips prefix="pub_att" opts={["гордость", "радость", "удивление", "безразличие", "дискомфорт", "неприятие"]} /></Field>
        <Field label="Пробуждение / реализация, лет">платоническое <Text id="aw_pl" cls="mini" /> / <Text id="aw_pl_r" cls="mini" /> · эротическое <Text id="aw_er" cls="mini" /> / <Text id="aw_er_r" cls="mini" /> · сексуальное <Text id="aw_sx" cls="mini" /> / <Text id="aw_sx_r" cls="mini" /></Field>
      </Group>
      <Group title="Мастурбация">
        <Field label="С, лет"><Text id="mast_from" cls="mini" /> оргазм с <Text id="mast_org" cls="mini" /> эякуляция с <Text id="mast_ejac" cls="mini" /></Field>
        <Chips prefix="mast_with" opts={["с фантазиями", "с порно"]} />
        <Field label="Клинический тип"><Chips prefix="mast_type" opts={["детская доэротическая", "ранняя допубертатная", "фрустрационная", "подражательная", "персевераторно-обсессивная", "юношеская гиперсексуальность", "заместительная"]} /></Field>
        <Field label="Отношение"><Chips prefix="mast_att" opts={["безопасна / полезна", "опасна / вред", "неприемлема", "стыд, вина, беспокойство"]} /></Field>
        <Field label="Прекратил"><Text id="mast_stop" /></Field>
      </Group>
      <Group title="Первый коитус и ритм">
        <Field label="Первый коитус, лет"><Text id="first_coitus" cls="mini" /><Chips prefix="first_coitus_w" opts={["девушка-девственница", "женщина", "будущая супруга до брака", "после брака"]} /></Field>
        <Chips prefix="first_coitus_init" opts={["обоюдное желание", "своя инициатива", "инициатива партнёрши", "принуждение"]} />
        <Chips prefix="first_coitus_alc" opts={["трезвый", "алкоголь лёгкий", "алкоголь сильный", "наркотик"]} />
        <Chips prefix="first_coitus_ok" opts={["удался", "не удался по своей вине", "по вине партнёрши", "внешние причины"]} />
        <Chips prefix="first_coitus_feel" opts={["оценка тогда +: позитивная", "негативная", "амбивалентная"]} />
        <Field label="Связи до текущей партнёрши"><Text id="pre_rel" area /></Field>
        <Field label="Ритм в 1-й год"><Text id="ufr_y1" /></Field>
        <Field label="УФР"><Text id="ufr_when" /> лет, <Chips prefix="ufr_how" opts={["сразу", "через месяцы/годы"]} /></Field>
        <Field label="Ритм за год до проблемы"><Text id="ufr_pre" /></Field>
        <Field label="Внебрачные связи"><Text id="extra" area /><Chips prefix="extra_why" opts={["любопытство", "самоутверждение", "новизна", "неудовлетворённость", "избирательная дисфункция к партнёрше", "месть", "новая любовь", "особые предпочтения"]} /></Field>
      </Group>
      <Group title="Репродукция и контрацепция">
        <Field label="Беременности от пациента">всего <Text id="preg" cls="mini" /> родов <Text id="birth" cls="mini" /> абортов <Text id="abort" cls="mini" /></Field>
        <Field label="Дети"><Text id="kids" area /></Field>
        <Field label="Контрацепция"><Chips prefix="contr" opts={["прерванный коитус", "презерватив", "календарный", "средства партнёрши", "другое"]} /></Field>
        <Field label="Влияние"><Chips prefix="contr_fx" opts={["желание ↓", "желание ↑", "эрекция ↓", "эрекция ↑", "коитус длиннее", "коитус короче"]} /></Field>
        <Field label="Половая инволюция"><Chips prefix="invol" opts={["приятие", "безразличие", "душевный дискомфорт", "неприятие"]} /><Text id="invol_n" area /></Field>
      </Group>
    </>
  );
}

function Soma({ female, go }) {
  return (
    <>
      <div className="flag">Антидепрессанты (особенно СИОЗС) — частая причина снижения либидо и отсроченного оргазма{female ? "" : " и ЭД"}. Не снимать препарат самостоятельно.{female ? " У женщин также учитывать КОК." : ""}</div>
      <Group title="Биологические факторы">
        <Field label="Патология беременности/родов у матери"><Text id="birth_mom" area /></Field>
        <Field label="Раннее развитие"><Text id="early" area /></Field>
        <Field label="Заболевания, операции, травмы">
          <Text id="dx" area />
          <Chips prefix="chr" opts={female
            ? ["диабет", "гипертония", "щитовидная железа", "депрессия", "тревожное расстройство", "неврология", "ССС", "гинекология"]
            : ["диабет", "гипертония", "щитовидная железа", "депрессия", "тревожное расстройство", "неврология", "ССС", "простата"]} />
        </Field>
        <Field label="Ночной энурез"><Text id="enuresis" /></Field>
        <Field label="Мочеиспускание"><Chips prefix="void" opts={["частые позывы", "боль/жжение", "недержание", "никтурия", "неполное опорожнение"]} /></Field>
        <Field label="Лекарства"><Text id="meds" area placeholder="препарат, доза, с какого времени" /></Field>
        <Field label="Аллергии"><Text id="allergy" /></Field>
        <Field label="Курение / алкоголь / ПАВ">
          <Text id="substances" area />
          <Chips prefix="alc_sex" opts={female
            ? ["алкоголь: желание ↓", "желание ↑", "возбуждение ↓", "возбуждение ↑", "оргазм ↓", "оргазм ↑"]
            : ["алкоголь: желание ↓", "желание ↑", "эрекция ↓", "эрекция ↑", "коитус длиннее", "короче"]} />
        </Field>
        <Field label="Профвредности"><Chips prefix="jobhaz" opts={["командировки", "сидячий режим", "ночные смены", "без отпуска", "шум", "токсины", "вибрация"]} /></Field>
        <Field label="Наследственность"><Text id="hered" area /></Field>
      </Group>
      <Group title="Непереработанный травматический опыт"><Text id="trauma" area placeholder="пренебрежение, насилие, утраты, расставания" /></Group>
      <Group title="Суицидальный риск">
        <Chips prefix="sui" opts={["мыслей нет", "мысли", "замысел", "намерение"]} />
        <Text id="sui_note" area />
      </Group>
      <p className="no-print"><button className="btn ghost" type="button" onClick={() => go("handouts")}>Памятки АД</button></p>
    </>
  );
}

function Partner({ female }) {
  const pWord = female ? "партнёр" : "партнёрша";
  return (
    <>
      <Group title="Статус">
        <Chips prefix="has_p" opts={female
          ? ["партнёра не было", "нет сейчас", "встречается", "незарегистрированный брак", "зарегистрированный брак"]
          : ["партнёрши не было", "нет сейчас", "встречается", "незарегистрированный брак", "зарегистрированный брак"]} />
        <Field label={"Длительность / возраст " + pWord}>
          <Text id="p_dur" />
          <Chips prefix="p_age" opts={female ? ["ровесник", "младше", "старше"] : ["ровесница", "младше", "старше"]} />
          <Text id="p_age_n" cls="mini" placeholder="на сколько лет" />
        </Field>
        <Field label="Основания союза"><Chips prefix="p_why" opts={["любовь", "сексуальная реализация", "беременность", "социальное давление", "бегство от родителей", "финансовая свобода"]} /></Field>
        <Field label="Привлекательность">
          <Chips prefix="p_attr" opts={["партнёра: высокая", "средняя", "низкая"]} />
          <Chips prefix="p_attr2" opts={["меня для партнёра: высокая", "средняя", "низкая"]} />
        </Field>
        <Field label={"Поведение " + pWord}><Chips prefix="p_beh" opts={["критикует внешность", "упрекает в неполноценности", "упрекает в недостатке любви", "обонятельное отвержение"]} /></Field>
        <Field label="Обнажённым рядом"><Chips prefix="nude" opts={["комфортно", "расслабленно", "раньше стеснялась/стеснялся", "смущённо", "нервно"]} /></Field>
        <Field label="Потребность партнёра в коитусе"><Text id="p_need" /></Field>
        <Field label="Отношение к проблеме">
          <Chips prefix="p_prob" opts={["с пониманием", "безразлично", "недовольство", "угрожает изменой", "угрожает разводом"]} />
          <Chips prefix="p_know" opts={["знает об обращении", "договаривается", "не знает"]} />
        </Field>
        <Field label="Вербальная сексуальная коммуникация"><Chips prefix="talk" opts={["чувства", "удовольствие", "техника", "контрацепция", "не обсуждают"]} /></Field>
        <Field label="Вне секса"><Chips prefix="out" opts={["выбор между партнёрами", "семьи происхождения", "охлаждение", "ревность", "неверность", "психопатология", "нет детей / разные желания"]} /></Field>
        <Field label="Чувства"><Chips prefix="feel" opts={["любовь", "уважение", "жалость", "страх", "стыд", "вина", "гнев", "обида", "ревность", "безразличие"]} /><Chips prefix="rely" opts={["может положиться", "не уверен(а)", "не может"]} /></Field>
      </Group>
      <Group title="Условия коитуса">
        <Chips prefix="cond_bad" opts={["нет изолированной комнаты", "спят родственники/дети", "может войти посторонний", "нет звукоизоляции", "раздельная постель", "разные комнаты", "раздельное проживание", "неудобное время"]} />
        <Field label="Предпочтительные условия"><Text id="cond_ok" area /></Field>
      </Group>
      <Group title="Ласки и фрикции">
        <Field label="Предварительные ласки, мин">сейчас <Text id="fore" cls="mini" /> раньше <Text id="fore_was" cls="mini" /></Field>
        <Field label="Пассивные ласки"><Chips prefix="pass" opts={["однообразные", "разнообразные", "поцелуй только в губы", "до груди", "до пупка", "всё тело включая гениталии"]} /></Field>
        <Field label="Активные ласки"><Chips prefix="act" opts={female
          ? ["однообразные", "разнообразные", "супружеский долг", "неприятие тела", "негативизм к гениталиям"]
          : ["однообразные", "разнообразные", "фаллоцентризм", "страх исчезновения эрекции", "страх ПЭ", "неприятие тела"]} /></Field>
        <Field label="Позиции"><Chips prefix="pos" opts={["ВВВ", "ВВН", "ВВБ", "ВВС", "ВВСт", "ВДВ", "ВДН", "ВДБ", "ВДС", "ВДСт"]} /></Field>
        <Field label="Качество фрикций"><Chips prefix="fric_q" opts={["односторонность", "однообразие", "стереотипность", "рассогласованность", "запаздывание реакции"]} /></Field>
        <Field label="Заключительные ласки, мин"><Text id="after" cls="mini" /></Field>
      </Group>
      <Group title="Предпочтения и культурный сценарий">
        <Chips prefix="pref" opts={["аудиальный", "визуальный", "кинестетический", "гиперролевой доминантный", "субмиссивно-мазохистический", "фетишистский", "вуайеристский", "эксгибиционистский", "групповой", "редукция романтического"]} />
        <Field label="Адаптация сценария"><Chips prefix="adapt" opts={["игровой вариант с партнёром", "параллельные фантазии", "подавление, только мастурбация"]} /></Field>
        <Field label="Культурный сценарий"><Chips prefix="cult" opts={["природный (гендер)", "брачно-пронатальный", "рыночный (обмен)", "гедонистический", "романтический", "коммуникативный"]} /></Field>
        <Field label="Неадекватные представления о норме"><Text id="myths" area /></Field>
        <Field label="Фрустрированные ожидания"><Text id="frust" area /></Field>
      </Group>
    </>
  );
}

function EzSelect({ id, opts }) {
  const state = useStore();
  return (
    <select value={state.fields[id] || ""} onChange={(e) => f(id, e.target.value)}>
      <option value="">—</option>
      {opts.map((s) => <option key={s}>{s}</option>)}
    </select>
  );
}

function EzTable({ kind, zones }) {
  return (
    <table className="table">
      <thead><tr><th>ЭЗ</th><th>О</th><th>ДП оральн.</th><th>ДП мануальн.</th></tr></thead>
      <tbody>
        {zones.map((z, i) => {
          const a = `${kind}${i}`;
          return (
            <tr key={a}>
              <td>{z}</td>
              <td><EzSelect id={a + "s"} opts={EZ_SCORE} /></td>
              <td><EzSelect id={a + "o"} opts={EZ_DP} /></td>
              <td><EzSelect id={a + "m"} opts={EZ_DP} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Ez({ female }) {
  return (
    <>
      <p className="legend">О: +4 оргазм … 0 безразлично … −3 противно; ? не знает; ! хочет повысить. ДП: + включить, − за границей.</p>
      {female ? (
        <>
          <Group title="Пациентка — пассивные ласки"><EzTable kind="ezf" zones={EZ_F} /></Group>
          <Group title="Партнёр — активные ласки"><EzTable kind="ezm" zones={EZ_M} /></Group>
        </>
      ) : (
        <>
          <Group title="Пациент — пассивные ласки"><EzTable kind="ezm" zones={EZ_M} /></Group>
          <Group title="Партнёрша — активные ласки"><EzTable kind="ezf" zones={EZ_F} /></Group>
        </>
      )}
      <Group title="Клинический тип ЭЗ">
        <Chips prefix="ez_type" opts={["генитальная адекватная", "генитальная неадекватная", "экстрагенитальная", "нет зрелой оргазмозапускающей"]} />
        <Text id="ez_note" area placeholder="триггеры неадекватной стимуляции" />
      </Group>
    </>
  );
}

function Exam({ female }) {
  const calcTi = () => {
    const h = Number(f("h")), leg = Number(f("leg"));
    if (h && leg) f("ti", (h / leg).toFixed(3));
  };
  const calcBmi = () => {
    const h = Number(f("h")) / 100, w = Number(f("w"));
    if (h && w) f("bmi", (w / (h * h)).toFixed(1));
  };
  if (female) {
    return (
      <>
        <p className="legend">В бланк — только патологические отклонения. Конституция: менархе, детородная функция, трохантерный индекс, оволосение, эротическое либидо, первый оргазм, 50–100% оргастичности.</p>
        <Group title="Антропометрия">
          <Field label="Рост / высота ноги, см">
            <Text id="h" cls="mini" /> / <Text id="leg" cls="mini" />
            <button className="btn ghost" type="button" onClick={calcTi}>ТИ</button>
            <Text id="ti" cls="mini" placeholder="ТИ" />
          </Field>
          <Field label="Вес / ИМТ">
            <Text id="w" cls="mini" /> / <Text id="bmi" cls="mini" />
            <button className="btn ghost" type="button" onClick={calcBmi}>ИМТ</button>
          </Field>
          <Field label="Оволосение лобка"><Chips prefix="hair" opts={["женский", "прореженное", "тенденция к мужскому", "мужской", "гирсутизм"]} /></Field>
          <Field label="Гирсутизм"><Chips prefix="hirs" opts={["I: белая линия / верхняя губа / ареолы", "II: подбородок / бакенбарды / внутр. бёдра", "III: грудина / спина / ягодицы / плечи"]} /></Field>
          <Field label="Внешний облик 0–4"><Chips prefix="look" opts={["0 грубые дефекты", "1 не с первого взгляда", "2 заурядность", "3 привлекательность", "4 редкая красота"]} /></Field>
        </Group>
        <Group title="Половая система (только патология)">
          <Field label="Выделения из молочных желёз"><Text id="galactorrhea" /></Field>
          <Field label="Вульва / влагалище / шейка / матка / придатки"><Text id="gu" area placeholder="только отклонения" /></Field>
          <Field label="Психический статус"><Text id="mse" area /></Field>
        </Group>
        <Group title="Индексы конституции">
          <Field label="Менархе / Кг"><Text id="menarche" /> / <Text id="kg" cls="mini" /></Field>
          <Field label="Срок беременности после начала отношений, годы"><Text id="preg_delay" cls="mini" /></Field>
          <Field label="Первый оргазм / через сколько лет отношений"><Text id="first_org" /> / <Text id="org_delay" cls="mini" /></Field>
          <Field label="50–100% оргастичности, лет"><Text id="org50_age" cls="mini" /></Field>
          <Field label="Кс / Кф / Кс÷Кг"><Text id="ks" cls="mini" /> / <Text id="kf" cls="mini" /> / <Text id="ks_kg" cls="mini" /></Field>
          <Text id="const_note" area placeholder="заключение по конституции" />
        </Group>
      </>
    );
  }
  return (
    <>
      <p className="legend">В бланк — только патологические отклонения. Конституция: возраст влечения, первая эякуляция, трохантерный индекс, оволосение, максимальный эксцесс, УФР.</p>
      <Group title="Антропометрия">
        <Field label="Рост / высота ноги, см">
          <Text id="h" cls="mini" /> / <Text id="leg" cls="mini" />
          <button className="btn ghost" type="button" onClick={calcTi}>ТИ</button>
          <Text id="ti" cls="mini" placeholder="ТИ" />
        </Field>
        <Field label="Вес / ИМТ">
          <Text id="w" cls="mini" /> / <Text id="bmi" cls="mini" />
          <button className="btn ghost" type="button" onClick={calcBmi}>ИМТ</button>
        </Field>
        <Field label="Оволосение лобка"><Chips prefix="hair" opts={["мужской с гипертрихозом", "мужской", "переходный", "женский", "пушковый"]} /></Field>
        <Field label="Внешний облик 0–4"><Chips prefix="look" opts={["0 грубые дефекты", "1 не с первого взгляда", "2 заурядность", "3 привлекательность", "4 редкая красота"]} /></Field>
      </Group>
      <Group title="Нервная / половая система">
        <Field label="Сексологические рефлексы"><Chips prefix="refl" opts={["кавернозный ↑", "кавернозный ↓", "не вызывается", "кремастерный ↑", "кремастерный ↓"]} /></Field>
        <Field label="Половой член / мошонка / простата"><Text id="gu" area placeholder="только патология" /></Field>
        <Field label="Психический статус"><Text id="mse" area /></Field>
      </Group>
      <Group title="Индексы конституции (Васильченко)">
        <Field label="Возраст пробуждения либидо → Кг"><Text id="kg" cls="mini" /></Field>
        <Field label="Первая эякуляция, лет"><Text id="first_ejac" /></Field>
        <Field label="Макс. эксцесс"><Text id="max_ex" cls="mini" /> в <Text id="max_ex_age" cls="mini" /> лет</Field>
        <Field label="УФР"><Text id="ufr" /></Field>
        <Field label="Ка / Кф"><Text id="ka" cls="mini" /> / <Text id="kf" cls="mini" /></Field>
        <Text id="const_note" area placeholder="заключение по конституции" />
      </Group>
    </>
  );
}

function Struct({ female, go }) {
  const state = useStore();
  const axes = structAxes(female);
  const dx = sexDx(female);
  const on = dx.filter((x) => !!state.checks["sdx:" + x.id]);
  const dur = Number(f("dur_mo") || 0);
  return (
    <>
      <p className="legend">{female ? "Три" : "Четыре"} составляющие копулятивного цикла. Место: ведущая / сопутствующая / следствие.</p>
      {axes.map(([t, h], i) => (
        <Group key={t} title={t}>
          <span className="legend">{h}</span>
          <Field label="Форма нарушения"><Text id={"st_form" + i} /></Field>
          <Field label="Шифр"><Text id={"st_code" + i} /></Field>
          <Field label="Место в структуре"><Chips prefix={"st_pl" + i} opts={["ведущая", "сопутствующая", "следствие"]} /></Field>
        </Group>
      ))}
      <Group title="Коды к рассмотрению">
        {dx.map((x) => (
          <Check key={x.id} id={"sdx:" + x.id}>{x.t} <span className="code">{x.codes}</span></Check>
        ))}
        {dur > 0 && dur < 6 ? <p>DSM: длительность &lt; 6 мес. — уточнить.</p> : null}
        <Field label="Длительность симптомов, мес."><Text id="dur_mo" cls="mini" /></Field>
      </Group>
      <Group title="Диагноз">
        <Field label="Предварительный"><Text id="predx" area /></Field>
        <Field label="Заключительный"><Text id="finaldx" area /></Field>
      </Group>
      <div className="card"><b>Отмечено:</b> {on.length ? on.map((x) => x.codes).join(", ") : "—"}</div>
      <p className="no-print"><button className="btn" type="button" onClick={() => go("opd")}>Дополнить OPD-3</button></p>
    </>
  );
}

function Plan({ female, go }) {
  return (
    <>
      <Group title="Консультации и исследования">
        <Chips prefix="cons" opts={female
          ? ["терапевт", "невролог", "эндокринолог", "гинеколог", "психиатр-нарколог", "психолог"]
          : ["терапевт", "невролог", "эндокринолог", "уролог", "андролог", "ангиохирург", "психиатр-нарколог", "психолог"]} />
        <Text id="labs" area placeholder="анализы, УЗИ, допплер — только обоснованные" />
      </Group>
      <Group title="1. Сексуальная ресоциализация">
        <p className="legend">Круг общения; смягчение конфликтов; вовлечение партнёра; убрать технические помехи.</p>
        <Text id="plan_resoc" area />
        <Field label="Психотерапия"><Text id="plan_pt" area /></Field>
      </Group>
      <Group title="2. Восстановительная терапия">
        <Chips prefix="sexth" opts={["патогенетическая", "десенсибилизирующая", "конструктивная", "реконструктивная процедурная", "вибрационная", "мастурбаторная", "парная"]} />
        <Field label="Секстерапия"><Text id="plan_sex" area /></Field>
        <Field label="Фармакотерапия"><Text id="plan_rx" area /></Field>
        <Chips prefix="phys" opts={["физиотерапия", "иглорефлексотерапия"]} />
      </Group>
      <Group title="3. Сексуальная реадаптация">
        <Chips prefix="read" opts={["адаптационная секстерапия", "библиотерапия"]} />
        <Text id="plan_read" area />
      </Group>
      <Group title="4. Реабилитация / компенсация">
        <Chips prefix="rehab" opts={["симптоматическая фармакотерапия", "адаптационная", "сценарно-ориентированная", "заместительная мастурбация/петтинг", "любриканты"]} />
        <Text id="plan_rehab" area />
      </Group>
      <p className="no-print"><button className="btn" type="button" onClick={() => go("handouts")}>Каталог раздаток</button></p>
      <p className="legend">Сексолог: А. Кавецкий</p>
    </>
  );
}
