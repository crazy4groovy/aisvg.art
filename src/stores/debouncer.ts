import { get, derived, type Writable } from "svelte/store";

export const debouncer = <T>(store: Writable<T>, timeoutMs = 500) =>
  derived(store, cb<T>(timeoutMs), get(store));

function cb<T>(timeoutMs: number) {
  return ($value: T, set: Function) => {
    const intervalId = setTimeout(() => set($value), timeoutMs);
    return () => clearTimeout(intervalId);
  };
}
