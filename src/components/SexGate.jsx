import { setSex } from "../store/useStore.js";

export default function SexGate() {
  return (
    <div className="gate">
      <div className="gate-atmosphere" aria-hidden="true" />
      <header className="gate-brand rise">
        <p className="gate-eyebrow">Кабинет</p>
        <h1>Сексология</h1>
        <p className="gate-lede">
          Адаптивное структурированное интервью. Сначала выберите профиль — мужчины, женщины или пара. От этого зависят маршрут и оформление.
        </p>
      </header>
      <div className="gate-choices gate-choices-3">
        <button type="button" className="gate-choice gate-m rise delay-1" onClick={() => setSex("m")}>
          <span className="gate-choice-kicker">Профиль</span>
          <span className="gate-choice-title">Мужчины</span>
          <span className="gate-choice-sub">Эрекция · эякуляция · 4 оси</span>
        </button>
        <button type="button" className="gate-choice gate-f rise delay-2" onClick={() => setSex("f")}>
          <span className="gate-choice-kicker">Профиль</span>
          <span className="gate-choice-title">Женщины</span>
          <span className="gate-choice-sub">Желание · возбуждение · 3 оси</span>
        </button>
        <button type="button" className="gate-choice gate-c rise delay-3" onClick={() => setSex("c")}>
          <span className="gate-choice-kicker">Профиль</span>
          <span className="gate-choice-title">Пары</span>
          <span className="gate-choice-sub">Диада · конфликт · сценарий</span>
        </button>
      </div>
      <p className="gate-foot rise delay-3">Данные остаются только в этом браузере</p>
    </div>
  );
}
