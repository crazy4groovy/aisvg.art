import { writable, get } from "svelte/store";
import { loadOriginalList, loadSvg4CroppedList, type Svg4Cropped } from "../lib/loaders";

import dateRange from '../lib/dateRange';

// dates: string[]
// images: object[]

export interface Img {
  src: string;
  id: string;
  meta?: any;
  searchTokens?: string[];
}

export interface Store {
  pages: string[];
  svg4CroppedImgs: Img[];
  originalCroppedImgs: Img[];
}

const defaultData: Store = {
  pages: [],
  svg4CroppedImgs: [],
  originalCroppedImgs: [],
};

export const store = writable<Store>(defaultData);

export const paginate = async () => {
  const x = get(store);

  // end recurse if past today's date
  if (new Date(x.pages[0]) > new Date()) return;

  const lastDate = x.pages[0] ?? "2023-04-23";
  let date: any = new Date(lastDate);
  date.setDate(date.getDate() + 1);
  date = date.toJSON().split("T")[0];

  let svg4Imgs = (await loadSvg4CroppedList(date)).map<Img>(
    (img) =>
      ({
        src: img.src,
        id: img.id,
      } as Img)
  );
  let svgIds = svg4Imgs.map((obj) => obj.id);

  const origImgs = (await loadOriginalList(date))
    .map<Img>(
      (arr) =>
        ({
          src: arr[0],
          id: arr[1],
          meta: arr[4],
          searchTokens: makeSearchTokens((arr[4] as any).textPrompt),
          date,
        } as Img)
    )
    .filter((origImg) => svgIds.includes(origImg.id));
  const origIds = origImgs.map((obj) => obj.id);

  svg4Imgs = svg4Imgs.filter((svgImg) => origIds.includes(svgImg.id));
  svgIds = svg4Imgs.map((obj) => obj.id);

  const set = new Set();
  x.svg4CroppedImgs = [...svg4Imgs, ...x.svg4CroppedImgs].filter((img) => {
    if (set.has(img.id)) {
      return false;
    }
    set.add(img.id);
    return true;
  });
  x.originalCroppedImgs = [...origImgs, ...x.originalCroppedImgs];
  x.pages = [date, ...x.pages];

  store.set(x);

  // recurse/loop call
  setTimeout(paginate, 1);
};

export const populate = async () => {
  const allDates = dateRange(new Date("2023-04-23"))
    .map(d => d.toISOString().split('T')[0])
    .reverse();

  const svgPromises: Array<Promise<Svg4Cropped[]>> = [];
  const origPromises: Promise<Array<string[]>>[] = [];

  // //
  const chunk = 30;
  let _svgs: PromiseSettledResult<Svg4Cropped[]>[] = [];
  let _origs: PromiseSettledResult<string[][]>[] = [];
  for (const date of allDates) {
    svgPromises.push(loadSvg4CroppedList(date));
    origPromises.push(loadOriginalList(date));

    if (svgPromises.length >= chunk) {
      _svgs = _svgs.concat(await Promise.allSettled(svgPromises));
      _origs = _origs.concat(await Promise.allSettled(origPromises));
      svgPromises.length = 0;
      origPromises.length = 0;
    }
  }
  _svgs = _svgs.concat(await Promise.allSettled(svgPromises));
  _origs = _origs.concat(await Promise.allSettled(origPromises));
  // //

  const svgs = _svgs
    .map(r => r.status === 'fulfilled' ? r.value : null)
    .flat()
    .filter(Boolean);
  const svgIds = new Set(svgs.map((obj) => obj.id));

  const origs = _origs
    .map(r => r.status === 'fulfilled' ? r.value : null)
    .flat()
    .filter(Boolean);
  const origIds = new Set(origs.map((arr) => arr[1]));

  let unique = new Set();
  const svg4Imgs = svgs
    .filter(img => origIds.has(img.id))
    .filter(img => {
      if (unique.has(img.id)) return false;
      unique.add(img.id);
      return true;
    })
    .map(img => ({
      src: img.src,
      id: img.id
    } as Img));

  unique = new Set();
  const origImgs = origs
    .filter((arr) => svgIds.has(arr[1]))
    .filter(arr => {
      if (unique.has(arr[1])) return false;
      unique.add(arr[1]);
      return true;
    })
    .map(arr => ({
      src: arr[0],
      id: arr[1],
      meta: arr[4],
      searchTokens: makeSearchTokens((arr[4] as any).textPrompt),
      date: arr[3]
    } as Img));

  store.set({
    pages: allDates,
    svg4CroppedImgs: svg4Imgs,
    originalCroppedImgs: origImgs
  });
}

function makeSearchTokens(textPrompt: string[]) {
  return textPrompt
    .join(" ")
    .toLowerCase()
    .replace(/[;:,.]/g, " ")
    .split(" ")
    .filter((t) => t.length > 2);
}
