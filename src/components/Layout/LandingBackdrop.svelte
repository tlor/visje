<script>
  import {onMount} from "svelte"
export let scroll = false;

let container

onMount(() => {
  // Fix chrome -webkit-fill-available
  const viewportHeight = window.innerHeight;
  container.style.height = viewportHeight + 'px';
});
</script>

<style>
.gradient-overlay {
  background-color: #390020;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpolygon fill='%23440227' points='800 100 0 200 0 800 1600 800 1600 200'/%3E%3Cpolygon fill='%234e042e' points='800 200 0 400 0 800 1600 800 1600 400'/%3E%3Cpolygon fill='%23580735' points='800 300 0 600 0 800 1600 800 1600 600'/%3E%3Cpolygon fill='%23610b3c' points='1600 800 800 400 0 800'/%3E%3Cpolygon fill='%236a0f43' points='1280 800 800 500 320 800'/%3E%3Cpolygon fill='%23721449' points='533.3 800 1066.7 800 800 600'/%3E%3Cpolygon fill='%23791950' points='684.1 800 914.3 800 800 700'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-position: 50%;
  background-size: cover;
}

.cover .container {
  /* mobile viewport bug fix iphone */
  height: -webkit-fill-available;
}
</style>

<div class="text-center gradient-overlay cover" class:overflow-auto={scroll}>
  <div class="container d-flex flex-column" bind:this={container}>
    <slot />
  </div>
</div>
