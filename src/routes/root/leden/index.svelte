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

  const dispatch = createEventDispatcher();
  export let members = [];
  const membersQuery = query(memberMany, { variables: { filter } });
  let filteredMembers;

  $: if ($membersQuery.data) {
    if (!members?.length) members = stripResult($membersQuery.data);
    filteredMembers = members;
  } else if ($membersQuery.error) {
    dispatch("error", $membersQuery.error);
  }

  const searchMembers = () => {
    if (searchQuery != "") {
      const queryValue = searchQuery.toLowerCase();
      // @ts-ignore
      filteredMembers = members.filter(
        // @ts-ignore
        (member) =>
          member.name.toLowerCase().match(queryValue) ||
          member.surname.toLowerCase().match(queryValue)
      );
    } else {
      // @ts-ignore
      filteredMembers = members;
    }
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
      <div class="col-6">
        <SearchField 
        bind:value={searchQuery}
        on:input={searchMembers}
        type="text"
        class="form-control mb-sm-0"
        placeholder="Zoek je Ichtiaan..."
        autocomplete="off" />
      </div>
      <!-- <div class="col-2 ps-0">
        <button type="button" class="btn bg-gradient-warning">Zoeken</button>
      </div> -->
    </div>

    <div class="row mt-md-5 mt-4">
      {#if $membersQuery.loading}
        <Loading />
      {:else if $membersQuery.error}
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
      {/if}
    </div>
  </div>
</section>
