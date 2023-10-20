<script>
  import ImageUpload from "@components/Elements/Inputs/ImageUpload.svelte";
  export let avatar, image;
  import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
  
  let quality = avatar ? 100 : 50;
  let enableZoom = avatar ? false : true;

  function change() {
    quality = 50;
    enableZoom = true;
    dispatch("change", image);
  }
  
</script>

<div class="form-group">
  <div class="d-flex flex-column">
    {#if avatar}
      <small class="text-light"> We hebben deze foto van je gevonden: </small>
    {:else}<small class="text-light">
        We hebben geen foto van je kunnen vinden
      </small>{/if}
    <ImageUpload {enableZoom} classes="rounded-circle" src={avatar} on:load={change} bind:output={image} quality />
  </div>
  <small class="text-muted">
    (Je kan verplaatsen en zoomen met 2 vingers)
  </small>
</div>
