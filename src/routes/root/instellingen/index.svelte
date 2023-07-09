<script lang="ts">
  import { currentSession, features } from "@root/_store";
  import GroupTable from "@components/Groups/GroupTable.svelte"
  if (!$currentSession) alert("No current session");
  const { member, user, groups } = $currentSession;
</script>

{#if $features?.members?.profileEdit}
  <div class="tw-mt-20 tw-text-center">
    Wijzig je persoonlijke gegevens op je <a class="" href="/@{user.username || user._id}" title="Naar profiel">profiel</a>
  </div>
{/if}
<section id="groups" class="tw-mt-20 col-lg-7 tw-min-h-25">
  <div class="container">
    <div class="row">
      <div
        class="tw-relative tw-flex tw-flex-col tw-min-w-0 tw-mb-6 tw-break-words tw-bg-white tw-border-0 dark:tw-bg-gray-950 dark:tw-shadow-soft-dark-xl tw-shadow-soft-xl tw-rounded-2xl tw-bg-clip-border"
      >
        <div class="tw-border-black/12.5 tw-rounded-t-2xl tw-p-6 tw-pb-0">
          <h6 class="dark:tw-text-white">Groepen</h6>
        </div>
<GroupTable {groups} memberID={member?.id}></GroupTable>

      </div>
    </div>
  </div>
</section>