<script context="module">
  import { Router } from "@roxi/routify";
  import routes from ".routify/routes.default.js";
  import ServiceWorker from "./ServiceWorker.svelte";
  import { updateGraphqlClient } from "@utils/graphql";

  /** @type {UrlRewrite}*/
  const urlRewrite = {
    toExternal: (url) => url,
    toInternal: (url) => {
      if (url.match("/beheer")) location.href = url; // Redirect to admin application
      return url;
    },
  };
</script>

<script>
  if (window.indexedDB && window.Pusher) {
    // Skip during build
    import("./services/push").then(async ({ beamsClient }) => {
      Pusher.logToConsole = true;

      var pusher = new Pusher(PUSHER_ID, {
        cluster: "eu",
      });

      var channel = pusher.subscribe("my-channel");
      channel.bind("my-event", function (data) {
        alert(JSON.stringify(data));
      });
      beamsClient = await beamsClient;
      beamsClient
        .start()
        .then((beamsClient) => beamsClient.getDeviceId())
        .then(() => beamsClient.addDeviceInterest("hello"))
        .then((deviceId) =>
          console.log(
            "Successfully registered with Beams. Device ID:",
            deviceId
          )
        )
        .catch(console.error);
    });
  }

  updateGraphqlClient();
</script>

<Router {routes} {urlRewrite} anchor="parent" />
<!-- if NODE_ENV === "local" -->
<ServiceWorker />
