import { useSyncExternalStore } from "react";
import { subscribe, getState } from "./store";

export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}

export { f, chk, selected, setPatient, reset, isF, ruDate, getState } from "./store";
