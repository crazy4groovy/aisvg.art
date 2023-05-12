// https://images.aisvg.art/gratisgraphics/original/ak__living-room-ly0ah7be.jpg

export async function loadSvg6List(date: string) {}

export async function loadSvg4List(date: string) {}

interface Svg4Cropped {
  id: string;
  src: string;
}
export async function loadSvg4CroppedList(
  date: string
): Promise<Svg4Cropped[]> {
  const text = await fetch(
    `https://images.aisvg.art/midjourney-showcase/svg-4-cropped/__final-${date}.txt`
  ).then((r) => r.text());

  const data = text
    .split("\r\n")
    .filter((l) => l.endsWith(".svg"))
    .map(
      (l) =>
        ({
          id: l.split(".").shift(),
          src: `https://images.aisvg.art/midjourney-showcase/svg-4-cropped/${l}`,
        } as Svg4Cropped)
    );

  return data;
}

export async function loadOriginalList(date: string): Promise<Array<string[]>> {
  const text = await fetch(
    `https://images.aisvg.art/midjourney-showcase/original/___jobs-${date}.yaml`
  ).then((r) => r.text());

  const data = text
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l.slice(2)))
    .map((arr) => [`${arr[0]}__${arr[1]}`, ...arr])
    .map((arr) => [
      `https://images.aisvg.art/midjourney-showcase/original/${arr[0]}.jpg`,
      ...arr,
    ]);

  return data;
}
