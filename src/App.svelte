<script lang="ts">
  import { onMount } from "svelte";

  import midjourneyLogo from "./assets/Midjourney.svg";
  import svgLogo from "./assets/SVG.svg";
  import { filterNeedleSearchTokens } from "./lib/filterNeedleSearchTokens";
  import { store as imgStore, paginate, populate, type Img } from "./stores/images";
  import { storeDebouncer as searchStoreDebouncer } from "./stores/searchText";
  import ImgCard from "./components/ImgCard.svelte";
  import SearchInput from "./components/SearchInput.svelte";
  import Details from "./components/Details.svelte";

  const searchStoreDebounced = searchStoreDebouncer(400);
  let svg4CroppedImgs: Img[];
  let originalCroppedImgs: Img[];
  let originalCroppedImgsById: Record<string, Img>;
  let displayedSvg4CroppedImgs: Img[];
  let pageNumber: number = 0;

  onMount(() => {
    // paginate();
    populate();
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

    const needleSearch = $searchStoreDebounced.toLocaleLowerCase();
    // console.log(needleSearch);

    if (needleSearch.length > 2) {
      displayedSvg4CroppedImgs = svg4CroppedImgs
        .filter(filterNeedleSearchTokens(originalCroppedImgsById, needleSearch))
        .slice(0, 100);
    } else {
      displayedSvg4CroppedImgs = svg4CroppedImgs.slice(
        pageNumber * 20,
        pageNumber * 20 + 20
      );
    }
    // console.log({displayedSvg4CroppedImgs})
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

    <Details title="Legal">
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
        No authorship or ownership of any artwork is claimed. Reasonable
        attempts to provide original sources and credit have been made by this
        site.
      </h2>

      <p>(More detailed information is available upon serious request.)</p>
    </Details>

    <h3>
      Original Midjourney images have had their backgrounds auto-cropped, then
      converted from a raster image into paths i.e. SVG.
    </h3>

    <h3>Hover/tap on the original image to reveal the remixed SVG.</h3>

    <h1 id="search-start">
      Browse {svg4CroppedImgs.length && svg4CroppedImgs.length.toLocaleString() || '...'} SVGs:
    </h1>

    {#if svg4CroppedImgs.length > 0}
      <SearchInput placeholder="Enter prompt keyword" />
    {:else}
      <hr />
      <div>Loading image data ... Please be patient</div>
      <hr />
    {/if}

    {#each displayedSvg4CroppedImgs as svg, i (svg.id)}
      <div>
        <h4>{svg.id}</h4>
        <p class="prompt">
          {
            originalCroppedImgsById[svg.id]?.meta.textPrompt[0]
            .replace(/,\s*/g, ', ')
            .replace(/\s+/g, ' ')
            ?? "(no prompt found)"
          }
        </p>
        <ImgCard src={svg.src} alt={svg.id} />
        <ImgCard
          src={originalCroppedImgsById[svg.id]?.src}
          alt={originalCroppedImgsById[svg.id]?.id}
          isTop={true}
        />
      </div>
    {/each}

    {#if displayedSvg4CroppedImgs.length > 0}
      <div class="pagination">
        {#if pageNumber > 0 && $searchStoreDebounced.length < 3}
          <button on:click={handlePrevPage} title="Prev Page">⏮</button>
        {/if}
        {#if $searchStoreDebounced.length < 3}
          <button on:click={handleNextPage} title="Next Page">⏭</button>
        {/if}
      </div>
    {/if}
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
