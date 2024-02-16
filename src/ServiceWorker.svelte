<script>
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import { notification } from "@root/_store";
  import { writable } from "svelte/store";
  
  export let newVersion;

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

  // $: prompt = $offlineReady || $needRefresh;

  // function close() {
  //   offlineReady.set(false);
  //   needRefresh.set(false);
  // }

  $: if($needRefresh && $newVersion) notification.set({ dismiss: false, type: "action", action: () => updateServiceWorker(true), actionText: "Vernieuwen",  content: `<strong>Nieuwe update! 🚀</strong> </br> Versie ${$newVersion} staat voor je klaar.` })
  $: if($offlineReady) notification.set({ icon: "✅", title:`Update geinstalleerd v${APP_VERSION}`, content: `Je bent weer helemaal bij, bekijk hier de <a href="${CHANGELOG_URL}">laatste updates🔗</a>.`, time: 7000 })
</script>

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
