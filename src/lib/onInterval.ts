import { onDestroy } from "svelte";

export function onInterval(callback: any, timeoutMs: number) {
  const intervalId = setInterval(callback, timeoutMs);
  onDestroy(() => {
    clearInterval(intervalId);
  });
}
