<script lang="ts">

  import { store } from "../stores/searchText";

  export let placeholder = "";

  function handleInput(target: any) {
    store.set(target.value.replace(/[\W]+/g, ''));
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<input
  type="text"
  on:input={(e) => handleInput(e.target)}
  value={$store}
  autofocus={true}
  class:inactive={$store.length <= 2}
  {placeholder}
/>

<style>
  input[type="text"] {
    padding: 1rem;
    background-color: yellowgreen;
    color: #333;
  }
  input.inactive {
    opacity: 0.5;
    background-color: #444;
    color: yellowgreen;
  }
</style>
