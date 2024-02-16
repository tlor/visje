<script context="module">
  import { get } from "svelte/store";
  import { session, currentSession } from "@root/_store";
  import { loggedIn, features, status } from "@root/_store";

  const _session = get(session);

  export const load = (url, ctx) => {
    const previousUrl = url.route.url.match(/^\/$|^$|login/) ? "" : `?url=${url.route.url}`;
    if (!_session.isValid && !loggedIn()) {
      console.debug("Redirecting to login" + previousUrl);
      return {
        redirect: "/login" + previousUrl,
      };
    } else if (loggedIn() && !_session.isValid) {
      console.debug("Redirecting to onboarding" + previousUrl);
      return {
        redirect: "/onboarding" + previousUrl,
      };
    }
  };
</script>

<script>
  import UserProfileAvatar from "@components/Profile/UserProfileAvatar.svelte";
  import Notifications from "@components/Notifications/Notifications.svelte";
  import { fade } from "svelte/transition";
  import Header from "@components/Layout/Header.svelte";
  import { goto } from "@roxi/routify";
  import { writable } from "svelte/store";
  import { isActive, context } from "@roxi/routify";
  import NavItem from "@components/Layout/NavItem.svelte";
  import Toast from "@components/Notifications/Toast.svelte";
  import ToastAction from "@components/Notifications/ToastAction.svelte";
  import Alert from "@components/Notifications/Alert.svelte";
  import { notifications } from "@root/_store";

  features.load();

  import Navigation from "@components/Layout/Navigation.svelte";
  console.log(
    `You are
${$session.username}
and have the following roles:
${[...$session.entitlements]}`,
    $currentSession,
  );

  // Workaround for isActive bug on home '/'
  let active = writable(null);
  const { user } = $currentSession;
  $: if ($context) active = $context.router.activeRoute;

  function enablePushNotifications() {
    if (window.indexedDB) {
      import("@services/pusher").then(async ({ beamsClient }) => {
        if(beamsClient){
          beamsClient = await beamsClient;
          beamsClient.start();
        }
      });
    }
  }

  function logout() {
    $session.invalidate();
    console.log("logged out");
    localStorage.removeItem("user"); // Remove user from local storage to undo any onboarding
    $goto("/login");
  }
</script>

<Navigation>
  <NavItem title="Home" link="/" icon="/assets/img/icons/svg/shop.svg" active={$active.url === "" || $active.url.startsWith("#")}></NavItem>
  <NavItem title="Groepen" link="/groepen" icon="/assets/img/icons/svg/office.svg" active={$active.url.match(/^\/groepen/)}></NavItem>
  <NavItem title="Leden" link="/leden" icon="/assets/img/icons/svg/user.svg" active={$active.url.match(/^\/leden|^\/@/)}></NavItem>
</Navigation>
<Header logo={false} admin={false}>
  <div></div>
  {#if user}
    <div class="tw-p-4 tw-flex tw-items-center z-index-2">
      {#if $features?.notifications?.badge}
        <Notifications notificationCount={0} on:click={enablePushNotifications}/>
      {/if}
      <UserProfileAvatar {user} status={$status.promise} on:logout={logout} >
        <small slot="status" class="tw-text-2 align-top">
          {#if $status === "polling"}
                <i class="ni ni-world spin ni-lg" title="Polling server"/>
          {:else if $status === "online"}
                <i class="ni ni-world ni-lg tw-text-green-600" title="Online"/>
          {:else}
                <i class="ni ni-world ni-lg tw-text-red-600" title="Offline" />
          {/if}
        </small>
      </UserProfileAvatar>
    </div>
  {/if}
</Header>
{#if $notifications.length}
  <div class="position-sticky z-index-sticky mx-auto tw-top-20 tw-h-0 toast-container">
    {#each $notifications as notification, i}
      {#if notification.type === "action"}
        <ToastAction on:close={() => notification.remove(i)} on:action={notification.action} {...notification}/>
      {:else if notification.type}
        <Alert style={notification.type} on:close={() => notification.remove(i)} {...notification}/>
      {:else}
        <Toast on:close={() => notification.remove(i)} {...notification}></Toast>
      {/if}
    {/each}
  </div>
{/if}
<div class="content tw-relative tw-min-h-screen">
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
  :global(body) {
    height: unset !important;
  }
  .content {
    overflow: hidden;
    scroll-behavior: smooth;
    overflow-y: auto;
  }
</style>
