<script>
  import ImageUpload from "@components/Elements/Inputs/ImageUpload.svelte";
  export let avatar, image;
</script>

<div class="form-group">
  <div class="d-flex flex-column">
    {#if avatar}
      <small class="text-light"> We hebben deze foto van je gevonden </small>
    {:else}<small class="text-light">
        We hebben geen foto van je kunnen vinden
      </small>{/if}

    <ImageUpload classes="rounded-circle" src={avatar} bind:output={image} />
  </div>
  <small class="text-muted">
    (Je kan verplaatsen en zoomen met 2 vingers)
  </small>
</div>
