<script>
  import { onMount } from "svelte";
  import "@static/assets/js/plugins/choices.min.js";

  import { userManySelect } from "@models/User/user.gql";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

    import { onDestroy } from 'svelte';
    import Loading from "@components/Elements/Loading.svelte";

  export let users = [];
  export let labelText = "Selecteer leden";
  export let selectedIds = [];
  export let selectedusers = [];
  const usersQuery = query(userManySelect, { variables: { filter: {
           // username: null
  }, limit: 200 } });

  $: if ($usersQuery.data) {
    if (!users?.length) users = stripResult($usersQuery.data);
    console.log(users)
  } else if ($usersQuery.error) {
    dispatch("error", $usersQuery.error);
  }

  let select;
  let selectChoice;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const valueMapper = (user) => 
    {
      return {
        value: user._id,
        label: user.displayName,
        username: user.username || "",
      };
    }
  

  $: if (mounted && $usersQuery.data) {
    const values = users.map(valueMapper);
    selectChoice = new Choices(select, {
      choices: values,
      removeItemButton: true,
      searchFields: ["label", "value", "username"],
      loadingText: "Loading...",
      noResultsText: "Geen leden gevonden",
      noChoicesText: "Geen leden om uit te kiezen",
      itemSelectText: "Klik om te selecteren",
    });
    selectChoice.setValue(selectedusers.map(valueMapper))
    mounted = false
  }

  function updateSelected() {
    if (users.length) {
      selectedIds = selectChoice.getValue(true);
      selectedusers = users.filter((m) => selectedIds.includes(m._id));
    }
  }

  onDestroy(() => {
    selectChoice.destroy();
    dispatch("destroyed")
  });

  $: if (selectChoice && !selectedusers.length) {
    selectChoice.destroy();
    selectChoice.init();
  }
</script>

<div class="tw-w-4/5 z-index-3">
  {#if !selectChoice || $usersQuery.loading}
    <Loading/>
  {/if}
  {#if $usersQuery.data}
    <label class="tw-mt-6 tw-mb-2 tw-ml-1 tw-font-bold tw-text-xs tw-text-slate-700 dark:tw-text-white/80" for="Skills">{labelText}</label>
  {/if}
  <select multiple bind:this={select} on:change={updateSelected} />
</div>
