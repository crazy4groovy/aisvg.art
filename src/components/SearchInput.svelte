<script lang="ts">

  import { store } from "../stores/searchText";

  export let placeholder = "";

  function handleInput(target) {
    store.set(target.value);
  }
</script>

<input
  type="text"
  on:input={(e) => handleInput(e.target)}
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
