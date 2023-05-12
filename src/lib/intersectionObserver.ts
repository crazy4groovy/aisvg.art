// import { readable, get } from "svelte/store";

export type Onload = (e: IntersectionObserverEntry) => void;

const isIntersectingLoadMap = new WeakMap<Element, Onload>();

let observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const onload = isIntersectingLoadMap.get(entry.target);
        onload?.(entry);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: .5 }
);

// let ctr = 0;
export default {
  async observe(entry: Element, onload?: Onload) {
    // console.log(ctr++, entry);
    if (onload) isIntersectingLoadMap.set(entry, onload);
    observer.observe(entry);
  },
  unobserve: observer.unobserve,
  // disconnect: observer.disconnect,
};
