import { writable } from "svelte/store";
import { debouncer } from "./debouncer";

export const store = writable<string>("");

export const storeDebouncer = (timeoutMs: number) =>
  debouncer(store, timeoutMs);
