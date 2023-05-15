<script>
export let version,
  logo = "../assets/images/logo/logo-white-192x192.png",
  supportLogo = "../assets/images/logo/tailor.png";

</script>

<style>
.heart {
  color: #eb5e28;
  animation: heathing 1s ease infinite;
}

.ichthus-logo {
  margin-top: .25rem;
  margin-left: .25rem;
}

@keyframes heathing {
  0% {
    transform: scale(0.75);
  }

  20% {
    transform: scale(1);
  }

  40% {
    transform: scale(0.75);
  }

  60% {
    transform: scale(1);
  }

  80% {
    transform: scale(0.75);
  }

  100% {
    transform: scale(0.75);
  }
}

</style>

<div class="row py-3">
  <div class="col-md-12">
    {#if version}<span class="small text-muted"> <i>v{version} </i> </span>{/if}
    <span class="d-flex justify-content-center align-items-center small text-muted font-weight-bold mb-5">
      Made with
      <i class="fa fa-2x fa-heart heart m-1" />
      for Ichthus
      <img class="ichthus-logo" src={logo} width="14px" />
    </span>
    <span class="small text-muted"> Copyright © 2020-2022 <img src={supportLogo} width="14px" /> Tailor Software </span>
  </div>
</div>
