<script>
  import { onMount } from "svelte";
  import "@static/assets/js/plugins/choices.min.js";

  import { gql } from "apollo-boost";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

    import { onDestroy } from 'svelte';
    import Loading from "@components/Elements/Loading.svelte";

  export let roles = [];
  export let labelText = "Selecteer rol";
  export let selectedId;
  export let selectedRole;
  const rolesQuery = query(gql`
    query { roleDistinct { roles } }`
  );

  $: if ($rolesQuery.data) {
    if (!roles?.length) roles = stripResult($rolesQuery.data).roles;
  } else if ($rolesQuery.error) {
    dispatch("error", $rolesQuery.error);
  }

  let select;
  let selectChoice;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const valueMapper = (role) => 
    {
      return {
        value: role,
        label: role,
        selected: selectedRole && selectedRole === role
      };
    }
  

  $: if (mounted && $rolesQuery.data) {
    const values = roles.map(valueMapper);
    selectChoice = new Choices(select, {
      choices: [{ value: "", label: "Lid"}, ...values],
      searchEnabled: false,
      addItemText: (value) => {
      return `Press Enter to add <b>"${value}"</b>`;
    },
      loadingText: "Loading...",
      noResultsText: "Geen rollen gevonden",
      noChoicesText: "Geen rollen om uit te kiezen",
      itemSelectText: "Klik om te selecteren",
    });
    mounted = false
  }

  function updateSelected() {
    if (roles.length) {
      selectedId = selectChoice.getValue(true);
      selectedRole = selectedId;
      dispatch("change", selectedRole)
    }
  }

  onDestroy(() => {
    selectChoice.destroy();
    dispatch("destroyed")
  });

  $: if (selectChoice && !selectedRole) {
    selectChoice.destroy();
    selectChoice.init();
  }
</script>

<div class="tw-w-4/5 z-index-3">
  {#if !selectChoice || $rolesQuery.loading}
    <Loading/>
  {/if}
  {#if $rolesQuery.data}
    <label class="tw-mt-6 tw-mb-2 tw-ml-1 tw-font-bold tw-text-xs tw-text-slate-700 dark:tw-text-white/80" for="Skills">{labelText}</label>
  {/if}
  <select bind:this={select} on:change={updateSelected} />
</div>
