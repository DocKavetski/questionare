const KEY = "kavetski_cabinet_v3";

const today = () => new Date().toISOString().slice(0, 10);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyVisit() {
  return {
    id: uid(),
    date: today(),
    domains: [],
    refinements: {},
    fields: {},
    checks: {},
    formulation: "",
    plan: "",
    nextVisit: "",
    structure: {},
  };
}

export function emptyCase() {
  const visit = emptyVisit();
  return {
    id: uid(),
    createdAt: today(),
    patient: { name: "", age: "", cardNo: "", sex: null },
    visits: [visit],
    activeVisitId: visit.id,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyCase();
    const data = JSON.parse(raw);
    if (!data.patient || !Array.isArray(data.visits) || !data.visits.length) return emptyCase();
    return data;
  } catch {
    return emptyCase();
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

export function activeVisit(s = state) {
  return s.visits.find((v) => v.id === s.activeVisitId) || s.visits[0];
}

function patchVisit(mutator) {
  const visit = activeVisit();
  const next = mutator({ ...visit, fields: { ...visit.fields }, checks: { ...visit.checks }, refinements: { ...visit.refinements }, structure: { ...visit.structure } });
  state = {
    ...state,
    visits: state.visits.map((v) => (v.id === visit.id ? next : v)),
  };
  persist();
}

export function setPatient(patch) {
  state = { ...state, patient: { ...state.patient, ...patch } };
  persist();
}

export function setSex(sex) {
  state = {
    ...state,
    patient: { ...state.patient, sex },
  };
  persist();
}

export function resetCase() {
  state = emptyCase();
  persist();
}

export function newVisit() {
  const visit = emptyVisit();
  state = {
    ...state,
    visits: [...state.visits, visit],
    activeVisitId: visit.id,
  };
  persist();
  return visit.id;
}

export function selectVisit(id) {
  if (!state.visits.some((v) => v.id === id)) return;
  state = { ...state, activeVisitId: id };
  persist();
}

export function toggleDomain(domainId) {
  patchVisit((v) => {
    const has = v.domains.includes(domainId);
    const domains = has ? v.domains.filter((d) => d !== domainId) : [...v.domains, domainId];
    const refinements = { ...v.refinements };
    if (has) delete refinements[domainId];
    return { ...v, domains, refinements };
  });
}

export function toggleRefinement(domainId, refId) {
  patchVisit((v) => {
    const cur = v.refinements[domainId] || [];
    const has = cur.includes(refId);
    const next = has ? cur.filter((x) => x !== refId) : [...cur, refId];
    return {
      ...v,
      refinements: { ...v.refinements, [domainId]: next },
    };
  });
}

export function f(id, value) {
  if (value !== undefined) {
    patchVisit((v) => ({ ...v, fields: { ...v.fields, [id]: value } }));
  }
  return activeVisit().fields[id] ?? "";
}

export function chk(id, value) {
  if (value !== undefined) {
    patchVisit((v) => ({ ...v, checks: { ...v.checks, [id]: !!value } }));
  }
  return !!activeVisit().checks[id];
}

export function setVisitMeta(patch) {
  patchVisit((v) => ({ ...v, ...patch }));
}

export function setStructureAxis(axisId, patch) {
  patchVisit((v) => ({
    ...v,
    structure: {
      ...v.structure,
      [axisId]: { ...(v.structure[axisId] || {}), ...patch },
    },
  }));
}

export function flatRefinements(visit = activeVisit()) {
  return Object.values(visit.refinements || {}).flat();
}

export function ruDate(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-");
  return `${d}.${m}.${y}`;
}
