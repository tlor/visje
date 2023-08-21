<script context="module">
  import Member from "@components/Members/Member.svelte";
  import Loading from "@components/Elements/Loading.svelte";
  import SearchField from "@components/Elements/Inputs/SearchField.svelte";
</script>

<script>
  import { createEventDispatcher } from "svelte";
  import { memberMany } from "@models/Member/member.gql";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";

  export let filter = {};

  let searchQuery = "";
  let searching = false;
  let loaded = false;

  const dispatch = createEventDispatcher();
  export let members = [];
  const initMembersQuery = query(memberMany, { variables: { filter, limit: 5 } }); // TODO: Fix better loading strategy
  const membersQuery = query(memberMany, { variables: { filter, limit: 200 } });
  let filteredMembers;

  $: if ($initMembersQuery.data) {
    if (!members?.length) members = stripResult($initMembersQuery.data);
    filteredMembers = members;
  } else if ($initMembersQuery.error) {
    dispatch("error", $initMembersQuery.error);
  }

  $: if ($membersQuery.data) {
    members = stripResult($membersQuery.data);
    filteredMembers = members;
    loaded = true
  } else if ($membersQuery.error) {
    dispatch("error", $membersQuery.error);
  }

  const searchMembers = async () => {
    searching = true;
    if($membersQuery.loading) {
      await new Promise(resolve => setInterval(() => loaded ? resolve() : false, 100))
    }
    if (searchQuery != "") {
      const queryValue = searchQuery.toLowerCase();
      // @ts-ignore
      filteredMembers = members.filter(
        // @ts-ignore
        (member) => member.name.toLowerCase().match(queryValue) || member.surname.toLowerCase().match(queryValue)
      );
    } else {
      // @ts-ignore
      filteredMembers = members;
    }
    searching = false;
  };
</script>

<section class="py-5">
  <div class="container">
    <div class="row">
      <div class="col-md-8 mx-auto text-center">
        <h6 class="text-gradient text-warning">Ledenlijst</h6>
        <h2>Ichthianen</h2>
      </div>
    </div>

    <div class="row mt-5 d-flex d-column justify-content-center">
      <div class="col-6 mb-2">
        <SearchField
          bind:value={searchQuery}
          on:input={searchMembers}
          type="text"
          class="form-control mb-sm-0"
          placeholder="Zoek je Ichtiaan..."
          autocomplete="off"
        />
      </div>
      <!-- <div class="col-2 ps-0">
        <button type="button" class="btn bg-gradient-warning">Zoeken</button>
      </div> -->
      {#if true}
        <div class="col-12 text-center">
          <Loading>
            <span class="tw-text-gray-500">Wachten op meer Ichthianen</span>
          </Loading>
        </div>
      {/if}
    </div>

    <div class="row mt-md-5 mt-4">
      {#if $initMembersQuery.loading}
        <Loading />
      {:else if $initMembersQuery.error}
        <div class="col-12 text-center">
          <span>Geen leden gevonden 😭</span>
        </div>
      {:else}
        {#each filteredMembers as member}
          <Member {member} />
        {:else}
          <div class="col-12 text-center">
            <span><b>{searchQuery}</b> niet gevonden 🫠</span>
          </div>
        {/each}
        {#if $membersQuery.loading}
          <div class="col-lg-3 col-6 mb-lg-0 mb-4">
            <Loading />
          </div>
        {/if}
      {/if}
    </div>
  </div>
</section>
