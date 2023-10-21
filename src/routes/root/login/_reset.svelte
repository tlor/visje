<!-- routify:meta reset=1 -->
<script context="module">
  import { loggedIn } from "@root/_store";

  export const load = (ctx) => {
    if (loggedIn())
      return {
        redirect: "/",
      };
  };
</script>

<script>
  import Footer from "@components-local/Layout/Footer.svelte";
  import LandingBackdrop from "@components-local/Layout/LandingBackdrop.svelte";
  import LandingContainer from "@components-local/Layout/LandingContainer.svelte";
</script>

<svelte:head>
  <link rel="stylesheet" href="/assets/css/login-ui.css" />
  <link rel="stylesheet" href="/assets/css/nucleo-icons-old.css" />
</svelte:head>

<LandingBackdrop>
  <LandingContainer>
    <slot />
  </LandingContainer>
  {#if __DEV__}
    <Footer version={APP_VERSION} />
  {:else}
    <Footer />
  {/if}
</LandingBackdrop>
