<script lang="ts">
  // credit: https://svelte.dev/repl/4b8ccdf1d01545baa0ab6a858bc05abb?version=3.32.1

  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  import observer, { type Onload } from "./intersectionObserver";

  export let onload: Onload;

  let loaded = false;
  let root;

  const onloadWrapper: Onload = (e: IntersectionObserverEntry) => {
    loaded = true;
    onload?.(e);
  };

  onMount(() => {
    observer.observe(root, onloadWrapper);
  });

  // onDestroy(() => {
  //   observer.unobserve(root);
  // });
</script>

<span bind:this={root}>
  {#if loaded}
    <span transition:fade>
      <slot />
    </span>
  {/if}
</span>
