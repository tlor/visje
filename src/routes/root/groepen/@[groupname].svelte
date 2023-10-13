<script>
    import { groupOne } from "@models/Group/group.gql";
    import MemberCard from "@components/Members/MemberCard.svelte";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  export let groupname;
  export let filter = {
    name: groupname
  }
  
  let group;

  const groupQuery = query(groupOne, { variables: { filter } });

  $: if ($groupQuery.data) {
    group = stripResult($groupQuery.data);
    console.log(group)
  } else if ($groupQuery.error) {
    console.log($groupQuery.error.message) // TODO: Add logging
  }

  $: if (groupname && group) {
    groupQuery.refetch();
  }
</script>
<section class="py-5 bg-gradient-{group?.color || "info"} position-relative overflow-hidden">
  <!-- <div class="position-absolute w-100 z-inde-1 top-0 mt-n3">
    <svg width="100%" viewBox="0 -2 1920 157" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>wave-down</title>
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g fill="#FFFFFF" fill-rule="nonzero">
                <g id="wave-down">
                    <path d="M0,60.8320331 C299.333333,115.127115 618.333333,111.165365 959,47.8320321 C1299.66667,-15.5013009 1620.66667,-15.2062179 1920,47.8320331 L1920,156.389409 L0,156.389409 L0,60.8320331 Z" id="Path-Copy-2" transform="translate(960.000000, 78.416017) rotate(180.000000) translate(-960.000000, -78.416017) "></path>
                </g>
            </g>
        </g>
    </svg>
  </div> -->
  <img src="../../assets/img/shapes/waves-white.svg" class="position-absolute opacity-6 h-100 top-0 d-md-block d-none" alt="">
  <div class="container pt-6 pb-5 position-relative z-index-3">
    <div class="row">
      <div class="col-md-6 mx-auto text-center">
        <span class="badge badge-white text-dark mb-2">{group?.type}</span>
        <h2 class="text-white mb-3">{groupname}</h2>
        <h5 class="text-white font-weight-light">
          {group?.description || ""}        
        </h5>
      </div>
    </div>
    <div class="row mt-8">
      {#if group?.members}
         {#each group.members as member}
         {@const memberMeta = group.roles.find((r) => r?.member?._id === member._id)}
          <div class="col-md-4 mb-md-0 mb-7">
            <MemberCard {member} description={memberMeta?.role || "lid"} link={true}/>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <div class="position-absolute w-100 bottom-0">
    <svg width="100%" viewBox="0 -1 1920 166" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>wave-up</title>
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(0.000000, 5.000000)" fill="#FFFFFF" fill-rule="nonzero">
                <g id="wave-up" transform="translate(0.000000, -5.000000)">
                    <path d="M0,70 C298.666667,105.333333 618.666667,95 960,39 C1301.33333,-17 1621.33333,-11.3333333 1920,56 L1920,165 L0,165 L0,70 Z"></path>
                </g>
            </g>
        </g>
    </svg>
  </div>
</section>

