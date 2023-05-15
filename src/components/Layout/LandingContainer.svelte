<script>
export let logo = "../assets/images/logo/logo-white.svg";

</script>

<style>
.row {
  z-index: 1;
}

</style>

<div class="row my-auto mx-auto index">
  <div class="text-white">
    <img class="mb-5" src={logo} width="100" />

    <div class="mb-5">
      <slot />
    </div>
  </div>
</div>
