<script>
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import { writable } from "svelte/store";

  const fn = () => {};
  let offlineReady = writable(null);
  let needRefresh = writable(null);
  let updateServiceWorker = fn;

  console.log(
    "Ichthus Visje versie:",
    APP_VERSION,
    `build: ${BUILD_DATE}, ${NODE_ENV}, ${SERVER_PORT}`
  );
  if (process.env.NODE_ENV === "local") {
    // Disable serviceworkers for local development
    console.warn("Serviceworker disabled for local development");
    if (navigator && navigator.serviceWorker)
      navigator.serviceWorker.register = () => new Promise(fn, fn);
  } else {
    // } else if ("serviceWorker" in navigator) {
    const sw = useRegisterSW({
      onRegistered(r) {
        if (RELOAD_SW === "true") {
          const intervalMS = 60 * 60 * 1000; // Check for new serviceworker every 1 Hour
          // If build with RELOAD_SW=true
          r &&
            setInterval(() => {
              console.log("Checking for sw update");
              r.update();
            }, intervalMS);
        } else {
          console.log(`SW Registered:`, r);
        }
      },
      onRegisterError(error) {
        console.log("SW registration error", error);
      },
    });
    offlineReady = sw.offlineReady;
    needRefresh = sw.needRefresh;
    updateServiceWorker = sw.updateServiceWorker;
  }

  $: prompt = $offlineReady || $needRefresh;

  function close() {
    offlineReady.set(false);
    needRefresh.set(false);
  }
</script>

{#if prompt}
  <div class="card pr-2">
    <div class="card-body">
      <span class="close" on:click={close}>×</span>
      <h6 class="category text-danger">
        <i class="now-ui-icons arrows-1_cloud-download-93" />
        {#if $offlineReady}Update geinstalleerd.{:else}Update beschikbaar.{/if}
      </h6>
      {#if $needRefresh}
        <p class="card-description">
          Vernieuw de app voor de laatste versie
          <a
            href="#"
            on:click={() => updateServiceWorker(true)}
            class="btn btn-default btn-round">Vernieuwen</a
          >
        </p>
      {/if}
      <div class="card-footer">
        <div class="stats stats-right">
          <i class="now-ui-icons design_app" />
          v{APP_VERSION}
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="build-date">{BUILD_DATE}</div>
<div class="build-version">{APP_VERSION}</div>

<style>
  span {
    text-decoration: none;
  }
  span.close {
    position: absolute;
    top: 0.5em;
    right: 0.3em;
    line-height: 10px;
  }
  .card {
    position: absolute;
    bottom: 0;
    left: 0;
    width: auto;
    z-index: 9999;
    background: white;
    margin-bottom: 0 !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    border-radius: 0 4px 0 0;
  }
  p {
    margin: 16px 32px;
  }
  .build-date,
  .build-version {
    visibility: hidden;
    display: none;
  }
</style>
