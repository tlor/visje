<script lang="ts">
  import { goto } from "@roxi/routify";
  import { session, currentSession, features } from "@root/_store";
  import { login } from "@endpoints/login.gql";
  import { query } from "svelte-apollo";
  import GroupTable from "@components/Groups/GroupTable.svelte"
  if (!$currentSession) alert("No current session");
  let { member, user, groups } = $currentSession;

  console.log("current", $currentSession)
const loginQuery = query(login);

const reload = async () => {
      await loginQuery
        .refetch({ input: { user: user.username.toLowerCase() } })
        .catch((err) => {
          const result = err.graphQLErrors[0]?.extensions;
          console.log("catch", result)

          if (result?.code === "I_USER_ONBOARDING") {
            $session.update(result);
            $session.save();
            if (location.pathname === "/onboarding") {
              window.location.reload();
            } else {
              $goto("/onboarding");
            }
          } else {
            $session.invalidate();
            window.location.reload();
          }
        })
        .then((result) => {
          if (result) {
            if(result.data.login.user.password === null) delete result.data.login.user.password
            $session.update(result.data.login);
            $session.save();
            window.location.reload();
          }
        });
    }
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
          <GroupTable {groups} memberID={member?._id} on:click={(e)=> $goto(`/groepen/@[groupname]`, { groupname: e.detail})}></GroupTable>
          <div class="tw-flex tw-my-4 tw-p-4 tw-rounded-xl tw-bg-gray-50 dark:tw-bg-gray-600">
            <h4 class="tw-my-auto dark:tw-text-white"><span class="tw-mr-1 tw-leading-normal tw-text-sm tw-text-slate-400 dark:tw-text-white/80">Vernieuw account en actualiseer rollen en rechten</span></h4>
            <a on:click={reload} class="tw-inline-block tw-px-6 tw-py-3 tw-mb-0 tw-ml-auto tw-font-bold tw-text-center tw-uppercase tw-align-middle tw-transition-all tw-bg-transparent tw-border tw-border-solid tw-rounded-lg tw-shadow-none tw-cursor-pointer tw-leading-pro tw-text-xs tw-ease-soft-in tw-tracking-tight-soft active:tw-opacity-85 active:tw-shadow-soft-xs hover:tw-scale-102 tw-border-slate-700 tw-text-slate-700 hover:tw-border-slate-700 hover:tw-bg-transparent tw-hover:tw-opacity-75 active:tw-border-slate-700 active:tw-bg-slate-700 tw-active:tw-text-white">Opnieuw laden</a>
          </div>
      </div>      
    </div>
  </div>
</section>