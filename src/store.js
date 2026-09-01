export const KEY = "kavetski_sexology_v2";
const today = () => new Date().toISOString().slice(0, 10);

export const empty = () => ({
  patient: { name: "", age: "", date: today(), cardNo: "", sex: "m" },
  fields: {},
  checks: {},
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const loaded = JSON.parse(raw);
    return {
      ...empty(),
      ...loaded,
      patient: { ...empty().patient, ...(loaded.patient || {}) },
      fields: loaded.fields || {},
      checks: loaded.checks || {},
    };
  } catch {
    return empty();
  }
}

let state = load();
const listeners = new Set();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return state;
}

export function setPatient(patch) {
  state = { ...state, patient: { ...state.patient, ...patch } };
  persist();
}

export function f(id, v) {
  if (v !== undefined) {
    state = { ...state, fields: { ...state.fields, [id]: v } };
    persist();
  }
  return state.fields[id] ?? "";
}

export function chk(id, v) {
  if (v !== undefined) {
    state = { ...state, checks: { ...state.checks, [id]: !!v } };
    persist();
  }
  return !!state.checks[id];
}

export function selected(prefix, opts) {
  return opts.filter((o) => chk(prefix + ":" + o));
}

export function reset() {
  state = empty();
  persist();
}

export function isF() {
  return state.patient.sex === "f";
}

export function ruDate(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-");
  return `${d}.${m}.${y}`;
}
