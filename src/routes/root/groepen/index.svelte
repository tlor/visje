<script context="module">
  import Group from "@components/Groups/Group.svelte";
  import Loading from "@components/Elements/Loading.svelte";
  import SearchField from "@components/Elements/Inputs/SearchField.svelte";
</script>

<script>
  import { createEventDispatcher } from "svelte";
  import { groupMany } from "@models/Group/group.gql";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  export let groups = [];
  export let filter = {};

  let filteredGroups;
    let searchQuery = "";
    let loaded = false;
  let searching = false;

  const dispatch = createEventDispatcher();

  const groupQuery = query(groupMany, { variables: { filter, limit: 200 }, fetchPolicy: "cache-first" });

  $: if ($groupQuery.data) {
    groups = stripResult($groupQuery.data);
    filteredGroups = groups
    loaded = true;
  } else if ($groupQuery.error) {
    dispatch("error", $groupQuery.error);
  }

  const searchGroups= async () => {
    searching = true;
    if($groupQuery.loading) {
      await new Promise(resolve => setInterval(() => loaded ? resolve() : false, 100))
    }
    if (searchQuery != "") {
      const queryValue = searchQuery.toLowerCase();
      // @ts-ignore
      filteredGroups = groups.filter(
        // @ts-ignore
        (group) => group.name.toLowerCase().match(queryValue)
      );
    } else {
      // @ts-ignore
      filteredGroups = groups;
    }
    searching = false;
  };
</script>

  <section class="py-lg-5 tw-min-h-screen">
    <div class="container">
      <div class="row mt-5 d-flex d-column justify-content-center">
      <div class="col-6 mb-2">
        <SearchField
          bind:value={searchQuery}
          on:input={searchGroups}
          type="text"
          class="form-control mb-sm-0"
          placeholder="Zoek je Commissie..."
          autocomplete="off"
        />
      </div>
      <!-- <div class="col-2 ps-0">
        <button type="button" class="btn bg-gradient-warning">Zoeken</button>
      </div> -->
      {#if $groupQuery.loading && searchQuery}
        <div class="col-12 text-center">
          <Loading>
            <span class="tw-text-gray-500">Wachten op laden van Groepen</span>
          </Loading>
        </div>
      {/if}
    </div>
      <div class="row mt-lg-5 mt-4">
    {#if $groupQuery.loading}
        <Loading />
      {:else if $groupQuery.error}
        <div class="col-12 text-center">
          <span>Geen groepen gevonden 😭</span>
        </div>
      {:else}
        {#each filteredGroups as group}
          <Group {group}></Group>
        {:else}
          <div class="col-12 text-center">
            <span><b>{searchQuery}</b> niet gevonden 🫠</span>
          </div>
        {/each}
        {#if $groupQuery.loading}
          <div class="col-lg-3 col-6 mb-lg-0 mb-4">
            <Loading />
          </div>
        {/if}
      {/if}
      </div>
    </div>
  </section>
