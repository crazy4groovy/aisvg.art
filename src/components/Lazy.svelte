<script lang="ts">
  // credit: https://svelte.dev/repl/4b8ccdf1d01545baa0ab6a858bc05abb?version=3.32.1

  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  import intersection, { type Onload } from "../lib/onloadIntersectionObserver";

  export let onload: Onload;

  let loaded = false;
  let root;

  const onloadWrapper: Onload = (e: IntersectionObserverEntry) => {
    loaded = true;
    onload?.(e);
  };

  onMount(() => {
    intersection.observe(root, onloadWrapper);
  });

  // onDestroy(() => {
  //   intersection.unobserve(root);
  // });
</script>

<span bind:this={root}>
  {#if loaded}
    <span transition:fade={{delay: 500, duration: 2000}}>
      <slot />
    </span>
  {/if}
</span>
