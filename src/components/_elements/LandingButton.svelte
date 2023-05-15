<script>
  export let submit = () => {};
</script>

<div class="text-right">
  <div class="login-btn">
    <button
      type="submit"
      {...$$props}
      on:click|preventDefault={submit}
      class="btn btn-light btn-round"
    >
      <slot />
    </button>
  </div>
</div>
