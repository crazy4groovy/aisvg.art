<script lang="ts">
  import { type Onload } from "./intersectionObserver";
  import Lazy from "./Lazy.svelte";
  export let src = "";
  export let alt = "";

  export let onload: Onload = (e) => {}
</script>

<Lazy {onload}>
  <img {src} {alt} loading="lazy" />
</Lazy>

<style>
  img {
    float: 1;
    max-height: 30vw;
  }
</style>
