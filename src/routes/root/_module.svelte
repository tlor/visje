<script context="module">
  import { get } from "svelte/store";
  import { session, currentSession } from "@root/_store";
  import { loggedIn, features, status } from "@root/_store"; 

  const _session = get(session);

  export const load = (ctx) => {
    if (!_session.isValid && !loggedIn()) {
      console.debug("Redirecting to login");
      return {
        redirect: "/login",
      };
    } else if (loggedIn() && !_session.isValid) {
      console.debug("Redirecting to onboarding");
      return {
        redirect: "/onboarding",
      };
    }
  };
</script>

<script>
  import UserProfileAvatar from "@components/Profile/UserProfileAvatar.svelte";
  import { fade } from "svelte/transition";
  import Header from "@components/Layout/Header.svelte";
  import { goto } from "@roxi/routify";
  import { writable} from "svelte/store"
  import { isActive, url, context  } from '@roxi/routify'
  import NavItem from "@components/Layout/NavItem.svelte";

  features.get()

  import Navigation from "@components/Layout/Navigation.svelte";
  console.log(
    `You are
${$session.username}
and have the following roles:
${[...$session.entitlements]}`,
    $currentSession
  );

  // Workaround for isActive bug on home '/'
  let active = writable(null)
  $: if($context) active = $context.router.activeRoute

  function logout() {
    $session.invalidate();
    console.log("logged out");
    $goto("/login");
  }
</script>

<Navigation>
   <NavItem title="Home" link="/" icon="/assets/img/icons/svg/shop.svg" active={$active.url === "/"}></NavItem>
   <NavItem title="Leden" link= "/leden" icon="/assets/img/icons/svg/user.svg" active={$isActive('/leden')}></NavItem>
</Navigation>

{#if $currentSession && $session.isValid}
  <Header>
    <UserProfileAvatar user={$currentSession.user} {status} on:logout={logout} />
  </Header>
  <div class="content tw-relative pt-7">
    <slot />
  </div>
{:else}
  <div in:fade={{ delay: 500 }}>
    Dit zou je niet moeten zien, maar worden doorverwezen naar de <a
      href="/login">login pagina</a
    >
  </div>
{/if}



<style lang="css">
  :global(.bg-ichthus) {
    background-color: #791950 !important;
  }
  :global(a.bg-ichthus:focus, a.bg-ichthus:hover, button.bg-ichthus:focus, button.bg-ichthus:hover) {
    background-color: #59123b !important;
  }
  :global(.text-muted) {
    color: #9a9a9a !important;
  }
  :global(#HW_badge) {
    position: absolute !important;
    top: 0px;
    left: 50px;
  }
  :global(#HW_frame_cont) {
    margin-top: 12px;
    width: 100%;
  }
  :global(#HW_badge_cont) {
    height: 16px;
    visibility: unset !important;
  }
  .content {
    min-height: 100vh;
    overflow: hidden;
  }
</style>
