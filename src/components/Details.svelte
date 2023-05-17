<script lang="ts">
  export let title: string = "";
</script>

<details class="legal">
  <summary>{title}</summary>
  <slot />
</details>

<style>
  details.legal {
    background-color: blueviolet;
    padding: 1rem;
    border-radius: 5px;
  }
  details.legal summary {
    cursor: pointer;
  }
  details.legal > * {
    cursor: text;
    font-size: 1rem;
  }
</style>
