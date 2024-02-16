<script>
  import { onMount } from "svelte";
  import "@static/assets/js/plugins/choices.min.js";

  import { memberManySelect } from "@models/Member/member.gql";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

    import { onDestroy } from 'svelte';
    import Loading from "@components/Elements/Loading.svelte";

  export let members = [];
  export let labelText = "Selecteer leden";
  export let selectedIds = [];
  export let selectedMembers = [];
  const membersQuery = query(memberManySelect, { variables: { filter: {} } });

  $: if ($membersQuery.data) {
    if (!members?.length) members = stripResult($membersQuery.data);
  } else if ($membersQuery.error) {
    dispatch("error", $membersQuery.error);
  }

  let select;
  let selectChoice;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const valueMapper = (member) => 
    {
      return {
        value: member._id,
        label: member.fullName,
        username: member.user?.username || "",
      };
    }
  

  $: if (mounted && $membersQuery.data) {
    const values = members.map(valueMapper);
    selectChoice = new Choices(select, {
      choices: values,
      removeItemButton: true,
      searchFields: ["label", "value", "username"],
      loadingText: "Loading...",
      noResultsText: "Geen leden gevonden",
      noChoicesText: "Geen leden om uit te kiezen",
      itemSelectText: "Klik om te selecteren",
    });
    if(selectedMembers) {
      selectChoice.setChoiceByValue(selectedMembers?._id);
    }
    mounted = false
  }

  function updateSelected() {
    if (members.length) {
      selectedIds = selectChoice.getValue(true);
      selectedMembers = members.filter((m) => selectedIds.includes(m._id));
    }
  }

  onDestroy(() => {
    selectChoice.destroy();
    dispatch("destroyed")
  });

  $: if (selectChoice && !selectedMembers?.length) {
    selectChoice.destroy();
    selectChoice.init();
  }
</script>

<div class="tw-w-4/5 z-index-3">
  {#if !selectChoice || $membersQuery.loading}
    <Loading/>
  {/if}
  {#if $membersQuery.data}
    <label class="tw-mt-6 tw-mb-2 tw-ml-1 tw-font-bold tw-text-xs tw-text-slate-700 dark:tw-text-white/80" for="Skills">{labelText}</label>
  {/if}
  <select multiple bind:this={select} on:change={updateSelected} />
</div>
