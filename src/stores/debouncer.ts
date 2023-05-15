import { get, derived, type Writable } from "svelte/store";

export const debouncer = <T>(store: Writable<T>, timeoutMs = 500) =>
  derived(
    store,
    ($value, set) => {
      const intervalId = setTimeout(() => set($value), timeoutMs);
      return () => clearTimeout(intervalId);
    },
    get(store)
  );
