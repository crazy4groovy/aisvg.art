<script lang="ts">
  import { type Onload } from "./onloadIntersectionObserver";
  import Lazy from "./Lazy.svelte";
  export let src = "";
  export let alt = "";
  export let isTop = false;

  export let onload: Onload = (e) => {}
</script>

<Lazy {onload}>
  <img {src} {alt} loading="lazy" class:isTop />
</Lazy>

<style>
  img {
    float: 1;
    width: min(40vw, 400px);
  }
  img.isTop {
    cursor: pointer;
    display: inline-block;
    transform: perspective(400px) translateX(calc(-1 * min(40vw, 400px) / 2)) rotateY(0);
    transition: .8s all ease-in-out;
  }
  img.isTop:hover, img.isTop:focus {
    transform: translateX(0) rotateY(12deg);
  }
</style>
