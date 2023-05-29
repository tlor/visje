<script lang="ts">
  import { currentSession, features } from "@root/_store";

  const { member, user, groups } = $currentSession;
</script>

{#if $features?.members?.profileEdit}
  <div class="tw-mt-20 tw-text-center">

  Wijzig je persoonlijke gegevens op je <a
    class=""
    href="/@{user.username || user._id}"
    title="Naar profiel">profiel</a
  >
  </div>
{/if}

<section id="groups" class="tw-mt-20 col-lg-7 tw-min-h-25">
  <div class="container">
  <div class="row">
<div class="tw-relative tw-flex tw-flex-col tw-min-w-0 tw-mb-6 tw-break-words tw-bg-white tw-border-0 dark:tw-bg-gray-950 dark:tw-shadow-soft-dark-xl tw-shadow-soft-xl tw-rounded-2xl tw-bg-clip-border">
              <div class="tw-border-black/12.5 tw-rounded-t-2xl tw-p-6 tw-pb-0 ">
                <h6 class="dark:tw-text-white">Groepen</h6>
              </div>

              <div class="tw-flex-auto tw-p-0 tw-pb-2 ">
                <div class="tw-p-0 tw-overflow-x-auto ps">
                  <table class="tw-items-center tw-justify-center tw-w-full tw-mb-0 tw-align-top tw-border-gray-200 dark:tw-border-white/40 dark:tw-text-white tw-text-slate-500">
                    <thead class="tw-align-bottom">
                      <tr>
                        <th class="tw-py-3 tw-pl-2 tw-pr-6 tw-font-bold tw-uppercase tw-align-middle tw-border-b tw-border-gray-200 tw-border-solid tw-text-xxs tw-text-slate-400 tw-opacity-70 tw-whitespace-nowrap tw-tracking-none">Groep</th>
                        <th class="tw-py-3 tw-pl-2 tw-pr-6 tw-font-bold tw-uppercase tw-align-middle tw-border-b tw-border-gray-200 tw-border-solid tw-text-xxs tw-text-slate-400 tw-opacity-70 tw-whitespace-nowrap tw-tracking-none">Rol</th>
                        <!-- <th class="tw-py-3 tw-pl-2 tw-pr-6 tw-font-bold tw-text-center tw-uppercase tw-align-middle tw-border-b tw-border-gray-200 tw-border-solid tw-text-xxs tw-text-slate-400 tw-opacity-70 tw-whitespace-nowrap tw-tracking-none">Ads Spent</th>
                        <th class="tw-py-3 tw-pl-2 tw-pr-6 tw-font-bold tw-text-center tw-uppercase tw-align-middle tw-border-b tw-border-gray-200 tw-border-solid tw-text-xxs tw-text-slate-400 tw-opacity-70 tw-whitespace-nowrap tw-tracking-none">Refunds</th> -->
                      </tr>
                    </thead>
                    <tbody class="tw-align-top">
                      {#each groups as group}
                      {@const memberMeta = group.roles.find((r) => r.member._id === member._id)}
                         <tr>
                        <td class="tw-p-2 tw-align-middle tw-border-b tw-border-solid dark:tw-border-white/40 tw-whitespace-nowrap tw-border-inherit">
                          <div class="tw-flex tw-px-4 tw-py-1">
                            <!-- <div>
                              <img class="tw-inline-flex tw-items-center tw-justify-center tw-w-12 tw-h-12 tw-mr-4 tw-text-white tw-transition-all tw-duration-200 tw-text-base tw-ease-soft-in-out tw-rounded-xl" src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/ecommerce/blue-shoe.jpg" alt="product image">
                            </div> -->
                            <div class="tw-flex tw-flex-col tw-justify-center">
                              <h6 class="tw-mb-0 tw-leading-normal dark:tw-text-white tw-text-sm">{group.name}</h6>
                              <!-- <p class="tw-mb-0 tw-font-semibold tw-leading-normal tw-text-sm tw-text-slate-400">
                                <span class="tw-text-lime-500">{group.members?.length}</span>
                                leden
                              </p> -->
                            </div>
                          </div>
                        </td>
                        <td class="tw-p-2 tw-align-middle tw-border-b tw-border-solid dark:tw-border-white/40 tw-whitespace-nowrap tw-border-inherit">
                          <p class="tw-mb-0 tw-font-semibold tw-leading-normal tw-text-sm">
                              {memberMeta?.role || "lid"}
                          </p>
                        </td>
                        <!-- <td class="tw-p-2 tw-text-center tw-align-middle tw-border-b tw-border-solid dark:tw-border-white/40 tw-whitespace-nowrap tw-border-inherit">
                          <p class="tw-mb-0 tw-font-semibold tw-leading-normal tw-text-sm">$9.500</p>
                        </td>
                        <td class="tw-p-2 tw-text-right tw-align-middle tw-border-b tw-border-solid dark:tw-border-white/40 tw-whitespace-nowrap tw-border-inherit">
                          <div class="tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-1">
                            <p class="tw-mb-0 tw-font-semibold tw-leading-normal tw-text-sm">13</p>
                            <i class="tw-mt-1 tw-ml-1 tw-leading-normal ni tw-leading-none ni-bold-down tw-text-sm tw-text-lime-500"></i>
                            <button type="button" class="active:tw-shadow-soft-xs tw-ml-4 active:tw-opacity-85 tw-ease-soft-in tw-leading-pro tw-text-xs tw-bg-150 tw-bg-x-25 tw-rounded-3.5xl tw-p-1.2 tw-h-6 tw-w-6 tw-mb-0 tw-flex tw-cursor-pointer tw-items-center tw-justify-center tw-border tw-border-solid tw-border-slate-400 tw-bg-transparent tw-text-center tw-align-middle tw-font-bold tw-text-slate-400 tw-shadow-none tw-transition-all hover:tw-bg-transparent hover:tw-text-slate-400 tw-hover:tw-opacity-75 tw-hover:tw-shadow-none active:tw-bg-slate-400 tw-active:tw-text-black hover:tw-active:tw-bg-transparent hover:active:tw-text-slate-400 hover:active:tw-opacity-75 hover:active:tw-shadow-none">
                              <i class="fas fa-info tw-text-3xs" aria-hidden="true"></i>
                            </button>
                          </div>
                        </td> -->
                      </tr>
                      {/each}                      
                    </tbody>
                  </table>
                <div class="ps__rail-x" style="left: 0px; top: 0px;"><div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps__rail-y" style="top: 0px; left: 0px;"><div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
              </div>
               </div>
                </div>
            </div></section>