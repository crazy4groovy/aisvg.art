import fzy from "fuzzysearch";
import type { Img } from "../stores/images";

// Creates a function compatible with an array's .filter callback API
export function filterNeedleSearchTokens(
  imgMap: Record<string, Img>,
  needle: string
): (value: Img, index: number, array: Img[]) => unknown {
  return (img): boolean =>
    imgMap[img.id].searchTokens.some((token) => fzy(needle, token));
}
