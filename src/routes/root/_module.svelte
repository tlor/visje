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
  import { isActive, context  } from '@roxi/routify'
  import NavItem from "@components/Layout/NavItem.svelte";
  import Toast from "@components/Notifications/Toast.svelte"
  import ToastAction from "@components/Notifications/ToastAction.svelte"
  import Alert from "@components/Notifications/Alert.svelte"
  import { notifications } from "@root/_store"

  features.load()

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
  const { user } = $currentSession
  $: if($context) active = $context.router.activeRoute

  function logout() {
    $session.invalidate();
    console.log("logged out");
    localStorage.removeItem("user"); // Remove user from local storage to undo any onboarding
    $goto("/login");
  }
</script>

  <Navigation>
    <NavItem title="Home" link="/" icon="/assets/img/icons/svg/shop.svg" active={$active.url === "/"}></NavItem>
    <NavItem title="Groepen" link="/groepen" icon="/assets/img/icons/svg/office.svg" active={$active.url.match(/^\/groepen/)}></NavItem>
    <NavItem title="Leden" link= "/leden" icon="/assets/img/icons/svg/user.svg" active={$isActive('/leden')}></NavItem>
  </Navigation>  
  <Header>
    {#if user}
       <UserProfileAvatar {user} {status} on:logout={logout} />
    {/if}    
  </Header>
  {#if $notifications.length} 
  <div class="position-sticky z-index-sticky mx-auto tw-top-20 tw-h-0 toast-container">
      {#each $notifications as notification,i}
      {#if notification.type === "action"}
         <ToastAction content={notification.content} on:close={() => notification.remove(i)} />
      {:else if notification.type}
         <Alert content={notification.content} style={notification.type} on:close={() => notification.remove(i)} />
      {:else}
         <Toast content={notification.content} on:close={() => notification.remove(i)}></Toast>
      {/if}
      {/each}   
  </div>      
  {/if}  
  <div class="content tw-relative">
    <slot />
  </div>

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
    overflow: hidden;
  }
</style>
