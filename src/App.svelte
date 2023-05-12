<script lang="ts">
  import midjourneyLogo from "./assets/Midjourney.svg";
  import svgLogo from "./assets/SVG.svg";

  import { store, paginate, type Img } from "./stores/images";
  import ImgCard from "./lib/ImgCard.svelte";

  let pages: string[];
  let svg4CroppedImgs: Img[];
  let originalCroppedImgs: Img[];
  let originalCroppedImgsById: Record<string, Img>;

  $: {
    ({ pages, svg4CroppedImgs, originalCroppedImgs } = $store);
    originalCroppedImgsById = originalCroppedImgs.reduce((map, img) => {
      map[img.id] = img;
      return map;
    }, {});
    console.log(originalCroppedImgsById);
    if (!pages.length) paginate();
  }
</script>

<main>
  <div>
    <div>
      <a href="https://svelte.dev" target="_blank" rel="noreferrer">
        <img src={midjourneyLogo} class="logo svelte" alt="Svelte Logo" />
      </a>
      <span class="arrow">➡</span>
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img src={svgLogo} class="logo" alt="Vite Logo" />
      </a>
    </div>

    <h1>Celebrating AI SVG Art.</h1>
    <h2>
      All source images were gathered from the Midjourney publicly viewable
      and remixable <a href="https://midjourney.com/showcase/recent/"
        >"showcase"</a
      >
      space, and are remixed explicitly under the fair-use, non-commercial license
      clause
      <a href="https://docs.midjourney.com/docs/terms-of-service#your-rights"
        >"Your Rights"</a
      >.
    </h2>

    <h2>
      No authorship or ownership of any artwork is claimed. Reasonable attempts
      to provide original sources and credit have been made by this site. (More
      detailed information is available upon serious request.)
    </h2>

    <h3>
      Original images have had their backgrounds auto-cropped, and then
      converted from a raster image into paths i.e. SVG.
    </h3>

    <h1>SVGs:</h1>

    {#each svg4CroppedImgs as svg, i (svg)}
      <h4>{svg.id}</h4>
      <p class="prompt">
        {originalCroppedImgsById[svg.id]?.meta.textPrompt ?? "no prompt found"}
      </p>
      <ImgCard
        src={svg.src}
        alt={svg.id}
        onload={i + 1 === svg4CroppedImgs.length ? paginate : undefined}
      />
      <ImgCard
        src={originalCroppedImgsById[svg.id]?.src}
        alt={originalCroppedImgsById[svg.id]?.id}
      />
    {/each}
  </div>
</main>

<style>
  h1,
  h4 {
    margin-top: 8rem;
  }
  h4 {
    color: #333;
    background-color: #eee;
    border-radius: 1rem;
  }
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
    background-color: white;
    border-radius: 1rem;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .prompt {
    opacity: 0.9;
    font-style: italic;
    width: 80%;
    text-align: center;
    margin-inline: auto;
    padding: 1rem;
  }
  .arrow {
    font-size: clamp(2rem, 10vw, 12rem);
    vertical-align: middle;
    transform: translateY(-50px);
    display: inline-block;
  }
</style>
