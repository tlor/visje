<script>
  import { onMount } from "svelte";
  import "@static/assets/js/plugins/choices.min.js";

  import { addressMany } from "@models/Address/address.gql";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

    import { onDestroy } from 'svelte';
    import Loading from "@components/Elements/Loading.svelte";

  export let addresses = [];
  export let labelText = "Selecteer locatie";
  export let selectedId = [];
  export let selectedAddress = null;
  const addressesQuery = query(addressMany, { variables: { filter: {} } });

  $: if ($addressesQuery.data) {
    if (!addresses?.length) addresses = stripResult($addressesQuery.data);
  } else if ($addressesQuery.error) {
    dispatch("error", $addressesQuery.error);
  }

  let select;
  let selectChoice;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const valueMapper = (address) => 
    {
      return {
        value: address._id,
        label: address.longName,
        short: address.shortName,
        street: address.street || "",
      };
    }
  

  $: if (mounted && $addressesQuery.data) {
    const values = addresses.map(valueMapper);
    selectChoice = new Choices(select, {
      choices: values,
      removeItemButton: true,
      searchFields: ["label", "value", "short", "street"],
      loadingText: "Loading...",
      noResultsText: "Geen locaties gevonden",
      noChoicesText: "Geen locaties om uit te kiezen",
      itemSelectText: "Klik om te selecteren",
    });
    if(selectedAddress) selectChoice.setValue(valueMapper(selectedAddress))
    mounted = false
  }

  function updateSelected() {
    if (addresses.length) {
      selectedId = selectChoice.getValue(true);
      selectedAddress = addresses.find((m) => selectedId === m._id);
      console.log(selectedAddress)
    }
  }

  onDestroy(() => {
    selectChoice.destroy();
    dispatch("destroyed")
  });

  $: if (selectChoice && !selectedAddress) {
    selectChoice.destroy();
    selectChoice.init();
  }
</script>

<div class="tw-w-4/5 z-index-3">
  {#if !selectChoice || $addressesQuery.loading}
    <Loading/>
  {/if}
  {#if $addressesQuery.data}
    <label class="tw-mt-6 tw-mb-2 tw-ml-1 tw-font-bold tw-text-xs tw-text-slate-700 dark:tw-text-white/80" for="Skills">{labelText}</label>
  {/if}
  <select bind:this={select} on:change={updateSelected} />
</div>
