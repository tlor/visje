<script>
  import Footer from "@components-local/Layout/Footer.svelte";
  import LandingBackdrop from "@components-local/Layout/LandingBackdrop.svelte";
  import LandingContainer from "@components-local/Layout/LandingContainer.svelte";
  import { currentSession, session } from "@root/_store";
  import { goto } from "@roxi/routify";

  $: if (!$currentSession?.token) {
    $goto("/");
  }

  function logout() {
    $session.invalidate();
    console.log("logged out");
    localStorage.removeItem("user"); // Remove user from local storage to undo any onboarding
    $goto("/");
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/assets/css/login-ui.css" />
</svelte:head>

<LandingBackdrop scroll={true}>
  <LandingContainer>
    <h5 class="d-flex flex-column">
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
