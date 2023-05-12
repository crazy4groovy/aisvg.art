export type Onload = (e: IntersectionObserverEntry) => void;

const isIntersectingLoadMap = new WeakMap<Element, Onload>();

let observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("__visible__", entry.isIntersecting);

      if (!entry.isIntersecting) return;

      const onload = isIntersectingLoadMap.get(entry.target);
      if (onload) {
        onload(entry);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 1, rootMargin: "-10px" }
);

export default {
  async observe(entry: Element, onload?: Onload) {
    if (onload) isIntersectingLoadMap.set(entry, onload);
    observer.observe(entry);
  },
  unobserve: observer.unobserve,
  // disconnect: observer.disconnect,
};
