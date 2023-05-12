import { writable, get } from "svelte/store";
import { loadOriginalList, loadSvg4CroppedList } from "../lib/loader";

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

  const lastDate = x.pages[0] ?? "2023-04-23";
  let date: any = new Date(lastDate);
  date.setDate(date.getDate() + 1);
  date = date.toJSON().split("T")[0];

  let svg4Imgs = (await loadSvg4CroppedList(date)).map<Img>((img) => ({
    src: img.src,
    id: img.id,
  }));
  let svgIds = svg4Imgs.map((obj) => obj.id);

  const origImgs = (await loadOriginalList(date))
    .map(
      (arr) =>
        ({
          src: arr[0],
          id: arr[1],
          meta: arr[4],
          searchTokens: (arr[4] as any).textPrompt.join(" ").toLowerCase().replace(/[;:,]/g, ' ').split(" ").filter(t => t.length > 2)
        } as Img)
    )
    .filter((origImg) => svgIds.includes(origImg.id));
  console.log(origImgs[0])
  const origIds = origImgs.map((obj) => obj.id);

  svg4Imgs = svg4Imgs.filter((svgImg) => origIds.includes(svgImg.id));
  svgIds = svg4Imgs.map((obj) => obj.id);

  x.svg4CroppedImgs = [...x.svg4CroppedImgs, ...svg4Imgs];
  x.originalCroppedImgs = [...x.originalCroppedImgs, ...origImgs];
  x.pages = [date, ...x.pages];

  store.set(x);

  if (svgIds.length) return paginate();
};
