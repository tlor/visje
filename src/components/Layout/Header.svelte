<script>
  export let header, adminRoutes, user, admin;
  import { goto, isActive, url } from "@roxi/routify";
  import menu from "@mockups/menu";
  import { alerts, status, currentSession, session } from "@root/_store";
  import { hasRole, hasRolesForPage } from "@services/roles";
  import { onMount } from "svelte";
  import "https://cdn.headwayapp.co/widget.js";

  function logout() {
    $session.invalidate();
    console.log("logged out");
    $goto("/");
  }

  function enablePushNotifications() {
    if (window.indexedDB) {
      import("@services/push").then(async ({ beamsClient }) => {
        beamsClient = await beamsClient;
        beamsClient.start();
      });
    }
  }

  onMount(() => {
    Headway.init({
      selector: "#HeadWay",
      account: "yEzQvx",
      translations: {
        title: "Updates",
        readMore: "Lees meer",
        labels: { new: "Nieuw!", improvement: "Verbetering", fix: "Fixed" },
        footer: "Lees verder 👉",
      },
    });
    var headwayWidgetReady = setInterval(function () {
      if (Headway.widgetIsReady) {
        const badge = document.getElementById("HW_badge_cont");
        try {
          badge.insertAdjacentElement("afterbegin", headwayUpdatesLink);
        } catch (error) {
          console.error("Failed to insert headway update badge");
        }
        clearWidgetReady();
      }
    }, 180);

    var clearWidgetReady = function () {
      clearInterval(headwayWidgetReady);
    };
  });

  let headwayUpdatesLink;
</script>

<nav
  class="navbar navbar-expand"
  class:bg-white={!admin}
  class:bg-ichthus={admin}
>
  <div class="container">
    <div class="navbar-translate">
      <a
        class="navbar-brand p-0 d-flex align-items-center m-0"
        href={header.logo.link}
      >
        <img
          src={admin ? header.logoWhite.image : header.logo.image}
          width="46"
          height="46"
          class="rounded-circle bg-transparent btn p-0 mr-2"
          alt="Logo"
        />
        <b class="d-none d-sm-block">{header.logo.title}</b>
        {#if admin}
          <small class="pl-2">admin</small>
        {/if}
      </a>
    </div>
    <div class="collapse navbar-collapse text-center justify-content-end">
      <ul class="navbar-nav mx-1 mx-sm-3">
        {#each header.nav.actionbar.items as item}
          <!-- Loop menu items, except when menu is privileged to a role check if user has role -->
          {#if item && (!item.role || (item.role && hasRole(item.role, $session.entitlements, true)))}
            <li class="nav-item dropdown">
              {#if !item.role || (item.role && hasRolesForPage($url("."), adminRoutes, $session.entitlements))}
                <a
                  class="nav-link"
                  href={$url(item.link)}
                  data-toggle="dropdown"
                >
                  <i class="{item.icon} fa-3x" />
                  <span class="d-none d-sm-block">{item.title}</span>
                </a>
              {/if}
              {#if item.items}
                <div class="dropdown-menu">
                  <!-- Push notifications/Meldingen menu -->
                  {#if item.title === "Meldingen"}
                    <a
                      href="#"
                      class="dropdown-header"
                      on:click={enablePushNotifications}
                    >
                      <i class="far d-inline fa-bell" />
                      Enable push notifications
                    </a>
                    <div class="dropdown-divider" />
                  {/if}
                  <!-- Other menu items -->
                  {#each item.items as submenu}
                    <a class="dropdown-item" href={$url(submenu.link)}>
                      {#if submenu.icon}<i
                          class="fa d-inline {submenu.icon}"
                        />{/if}
                      {submenu.title}
                    </a>
                  {/each}
                  <!-- Admin menu -->
                  {#if adminRoutes && item.role && hasRolesForPage($url("."), adminRoutes, $session.entitlements)}
                    {#each adminRoutes as admin}
                      {#if admin.pages.some((page) => $isActive(page))}
                        <h6 class="dropdown-header">Op deze pagina</h6>
                        <div class="dropdown-divider" />
                        {#each admin.items as option}
                          {#if hasRole(option.role, $session.entitlements, false, admin.role)}
                            <a
                              class="dropdown-item"
                              href={$url("/" + option.link, {
                                back: $url("."),
                              })}
                            >
                              {#if option.icon}<i
                                  class="fa d-inline {option.icon}"
                                />{/if}
                              {option.title}
                            </a>
                          {/if}
                        {/each}
                      {/if}
                    {/each}
                  {/if}
                </div>
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
      <!-- Profiel menu & avatar -->
      <div class="dropdown">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#" id="userMenu" data-toggle="dropdown" class="">
          <img
            class="rounded-circle btn p-0"
            src={user.avatar}
            width="56"
            alt="Current user avatar"
          />
        </a>
        <div
          class="dropdown-menu dropdown-menu-right"
          aria-labelledby="userMenu"
        >
          <h6 class="dropdown-header">
            {user.username}
            {#each $currentSession?.groups as group}
              <small class="dropdown-header pb-0">{group.name}</small>
            {/each}
          </h6>
          <div class="dropdown-divider" />
          <small class="dropdown-header position-relative">
            <a
              class="text-decoration-none"
              href="#"
              bind:this={headwayUpdatesLink}>Updates</a
            >
            <div id="HeadWay" />
          </small>
          <div class="dropdown-divider" />
          <!-- svelte-ignore a11y-invalid-attribute -->
          <!-- <a class="dropdown-item" href={$url("/account")}>Profiel</a> -->
          <a class="dropdown-item" href="#" on:click|preventDefault={logout}
            >Uitloggen</a
          >
        </div>
        <div class="status">
          <div class="card-pricing">
            {#await $status.promise}
              <a class="nav-link icon" href="#" title="Polling server">
                <i class="now-ui-icons loader_refresh spin" />
              </a>
            {:then _}
              <a
                class="nav-link icon icon-success"
                href="#"
                title="Server online"
              >
                <i class="now-ui-icons media-2_sound-wave" />
              </a>
            {:catch _}
              <a
                class="nav-link icon icon-danger"
                href="#"
                title="Server unreachable"
              >
                <i class="now-ui-icons business_globe" />
              </a>
            {/await}
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
{#if !admin}
  <nav class="menu">
    <div class="container">
      <div class="row">
        <div class="col p-0" id="navigation">
          <ul
            class="nav nav-pills nav-pills-info nav-pills-just-icons justify-content-between"
          >
            {#each menu.items as item}
              {#if item.items}
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle m-0"
                    href={$url(item.link)}
                    aria-controls={item.title}
                    aria-expanded="false"
                    data-target="#{item.title}"
                    data-toggle="collapse"
                  >
                    <i class={item.icon} />
                    <span class="d-none d-lg-block">{item.title}</span>
                  </a>
                </li>
              {:else}
                <li class="nav-item">
                  <a class="nav-link m-0" href={$url(item.link)}>
                    <i class={item.icon} />
                    <span class="d-none d-lg-block">{item.title}</span>
                  </a>
                </li>
              {/if}
            {/each}
          </ul>
          <div class="container">
            <div class="row">
              <div class="col text-center" id="submenus">
                {#each menu.items.filter((i) => i.items) as item}
                  <div
                    class="collapse"
                    aria-labelledby={item.title}
                    data-parent="#submenus"
                    id={item.title}
                  >
                    <ul
                      class="nav nav-pills nav-pills-primary justify-content-center"
                      role="tablist"
                    >
                      {#each item.items as subitem}
                        <li class="nav-item">
                          <a href={$url(subitem.link)} class="nav-link">
                            <i class="fa {subitem.icon}" />
                            {subitem.title}
                          </a>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
{/if}
{#if $alerts && $alerts.length}
  {#each $alerts as alert}
    <!-- TODO: Add new alert -->
  {/each}
{/if}

<style lang="scss">
  // Sub navigation responsive
  ul.nav-pills-just-icons {
    flex-wrap: nowrap;
    padding-top: 2px;
    height: 6em;
  }
  @media screen and (max-width: 520px) {
    ul.nav-pills-just-icons {
      overflow-x: auto;
      overflow-y: hidden;
    }
  }

  @media screen and (min-width: 992px) {
    ul.nav-pills-just-icons .nav-item {
      margin-right: 3em !important;
    }
  }

  @media screen and (max-width: 520px) {
    ul.nav-pills-just-icons .nav-item:first-child {
      padding-left: 1em !important;
    }
    ul.nav-pills-just-icons .nav-item:last-child {
      padding-right: 1em !important;
    }
  }

  ul.nav-pills-just-icons .nav-link {
    position: relative;
    height: 56px;
    width: 56px;
    margin-bottom: 1em;

    i {
      line-height: 56px;
    }
  }
  ul.nav-pills-just-icons .nav-item {
    margin-right: 0.8em;
  }
  ul.nav-pills-just-icons .nav-item:first-child {
    margin-left: 0.8em;
  }

  #submenus {
    .nav-link {
      margin-bottom: 0.8em;
      display: flex;
      align-items: center;
      i {
        line-height: 0;
        margin-right: 0.5em;
      }
    }
  }

  // Push notification button style
  .dropdown-menu .dropdown-header {
    color: rgba(182, 182, 182, 0.6);
    font-size: 0.7142em;
    text-transform: uppercase;
    font-weight: 700;
  }

  // Disable default style for status icons
  .nav-link.icon i {
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    width: 16px;
  }
  .status {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
