/** Profile: m | f | c (couple) */

export const PROFILES = [
  { id: "m", label: "Мужчины", short: "мужчины", theme: "theme-m", protocol: "м" },
  { id: "f", label: "Женщины", short: "женщины", theme: "theme-f", protocol: "ж" },
  { id: "c", label: "Пары", short: "пара", theme: "theme-c", protocol: "пара" },
];

export function profileMeta(id) {
  return PROFILES.find((p) => p.id === id) || PROFILES[0];
}

export function themeClass(id) {
  return profileMeta(id).theme;
}

export function nextProfile(id) {
  const i = PROFILES.findIndex((p) => p.id === id);
  return PROFILES[(i + 1) % PROFILES.length].id;
}
