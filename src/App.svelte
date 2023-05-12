<script lang="ts">
  import { onMount } from "svelte";
  import fzy from "fuzzysearch";
  import midjourneyLogo from "./assets/Midjourney.svg";
  import svgLogo from "./assets/SVG.svg";

  import { store as imgStore, paginate, type Img } from "./stores/images";
  import { store as searchStore } from "./stores/searchText";
  import ImgCard from "./lib/ImgCard.svelte";
  import SearchInput from "./lib/SearchInput.svelte";

  // let pages: string[];
  let svg4CroppedImgs: Img[];
  let originalCroppedImgs: Img[];
  let originalCroppedImgsById: Record<string, Img>;
  let displayedSvg4CroppedImgs: Img[];
  let pageNumber: number = 0;

  onMount(() => {
    paginate();
  });

  function handleNextPage() {
    pageNumber += 1;
    document.querySelector("#search-start")?.scrollIntoView();
  }

  function handlePrevPage() {
    pageNumber = Math.max(0, pageNumber - 1);
    document.querySelector("#search-start")?.scrollIntoView();
  }

  $: {
    ({ svg4CroppedImgs, originalCroppedImgs } = $imgStore);
    originalCroppedImgsById = originalCroppedImgs.reduce((map, img) => {
      map[img.id] = img;
      return map;
    }, {});

    const needle = $searchStore.toLocaleLowerCase();
    const filterImgs = filterNeedle(needle);

    if (needle.length <= 2) {
      displayedSvg4CroppedImgs = svg4CroppedImgs.slice(
        pageNumber * 15,
        pageNumber * 15 + 15
      );
    } else {
      displayedSvg4CroppedImgs = svg4CroppedImgs
        .filter(filterImgs)
        .slice(0, 50);
    }
  }

  function filterNeedle(
    needle: string
  ): (value: Img, index: number, array: Img[]) => unknown {
    return (img): boolean =>
      originalCroppedImgsById[img.id].searchTokens.some((token) =>
        fzy(needle, token)
      );
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
      All source images were gathered from the Midjourney publicly viewable and
      remixable <a href="https://midjourney.com/showcase/recent/">"showcase"</a>
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
      Original images had their backgrounds auto-cropped, then converted from a
      raster image into paths i.e. SVG.
    </h3>

    <h3>Hover/tap on the original image to reveal the remixed SVG.</h3>

    <h1 id="search-start">SVGs:</h1>

    <SearchInput placeholder="Prompt Search" />

    {#each displayedSvg4CroppedImgs as svg, i (svg)}
      <h4>{svg.id}</h4>
      <p class="prompt">
        {originalCroppedImgsById[svg.id]?.meta.textPrompt ?? "no prompt found"}
      </p>
      <ImgCard src={svg.src} alt={svg.id} />
      <ImgCard
        src={originalCroppedImgsById[svg.id]?.src}
        alt={originalCroppedImgsById[svg.id]?.id}
        isTop={true}
      />
    {/each}

    <div class="pagination">
      {#if pageNumber > 0 && $searchStore.length < 3}
        <button on:click={handlePrevPage} title="Prev Page">⏮</button>
      {/if}
      {#if $searchStore.length < 3}
        <button on:click={handleNextPage} title="Next Page">⏭</button>
      {/if}
    </div>
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
    border-radius: 0.5rem;
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
  .pagination {
    margin: 2rem;
  }
</style>
