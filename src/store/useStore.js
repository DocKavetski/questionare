import { useSyncExternalStore } from "react";
import { subscribe, getState } from "./store.js";

export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}

export {
  f, chk, setPatient, setSex, resetCase, newVisit, selectVisit,
  toggleDomain, toggleRefinement, setVisitMeta, setStructureAxis,
  activeVisit, flatRefinements, ruDate,
} from "./store.js";
