<script context="module">
  import { Router } from "@roxi/routify";
  import routes from ".routify/routes.default.js";
  import ServiceWorker from "./ServiceWorker.svelte";
  import { updateGraphqlClient } from "@utils/graphql";
  import { pushService } from "@root/_store";

  // Default pusher channel
  pushService.getInstance().then((pusher) => {
    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function (data) {
      alert(JSON.stringify(data));
    });
  });

  /** @type {UrlRewrite}*/
  const urlRewrite = {
    toExternal: (url) => url,
    toInternal: (url) => {
      if (url && url.match("/beheer")) location.href = url; // Redirect to admin application
      return url;
    },
  };
</script>

<script>
  updateGraphqlClient();
</script>

<Router {routes} {urlRewrite} anchor="parent" />
<!-- if NODE_ENV === "local" -->
<ServiceWorker />
