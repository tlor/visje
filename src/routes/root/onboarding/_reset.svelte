<script context="module">
  import { get } from "svelte/store";
  import { session, currentSession, loggedIn } from "@root/_store";

  const _session = get(session);

  export const load = (ctx) => {
    if (!_session.isValid && !loggedIn()) {
      console.debug("Redirecting to login");
      return {
        redirect: "/login",
      };
    }
  };
</script>

<script>
  import Footer from "@components-local/Layout/Footer.svelte";
  import LandingBackdrop from "@components-local/Layout/LandingBackdrop.svelte";
  import LandingContainer from "@components-local/Layout/LandingContainer.svelte";
  import { goto } from "@roxi/routify";

  function logout() {
    $goto("/logout");
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/assets/css/login-ui.css" />
</svelte:head>

<LandingBackdrop scroll={true}>
  <LandingContainer>
    <h5 class="d-flex flex-column text-white mb-4">
      Welkom! 😀
      <small>
        {$currentSession?.user.displayName}
        <a href="#" on:click|preventDefault={logout}>(Uitloggen)</a>
      </small>
    </h5>
    <slot />
  </LandingContainer>
  <Footer />
</LandingBackdrop>

<style>
</style>
