<script lang="ts">
  import { store } from "../stores/searchText";

  export let placeholder = "";
</script>

<input
  type="text"
  bind:value={$store}
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
