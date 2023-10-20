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

<svelte:head>
  <!-- Pusher -->
	<script src="https://js.pusher.com/7.2/pusher.min.js"></script>
	<script async src="//cdn.headwayapp.co/widget.js"></script>
  
  <!-- Fonts -->
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
	<script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>
</svelte:head>

<script>
  updateGraphqlClient();
</script>

<Router {routes} {urlRewrite} anchor="parent" />
<!-- if NODE_ENV === "local" -->
<ServiceWorker />
