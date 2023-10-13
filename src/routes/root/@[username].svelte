<script>
  import Wave from "@components/Layout/Wave.svelte";
  import MemberCard from "@components/Members/MemberCard.svelte";
  import { memberById, memberOne } from "@models/Member/member.gql";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  import Loading from "@components/Elements/Loading.svelte";
  import { currentSession, features } from "@root/_store";

  export let username;
  export let filter = {
    username
  }
  let member;

  export let id = username.length === 24 ? username : "";

  const getAge = (birthDate) => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  const memberQuery = id ? query(memberById, { variables: { id: id } }) : query(memberOne, { variables: { filter } });

  $: if ($memberQuery.data) {
    member = stripResult($memberQuery.data);
  } else if ($memberQuery.error) {
    console.log($memberQuery.error.message) // TODO: Add logging
  }

  $: if (username && member) {
    memberQuery.refetch();
  }

        const randomMottos = [
    "Altijd blijven leren",
    "Vrijheid door verantwoordelijkheid",
    "Geef nooit op",
    "Laten we gek doen",
    "Samen staan we sterk",
    "Leef het leven ten volle",
    "Niets is onmogelijk",
    "Doorbreek de sleur",
    "Elke dag een nieuw avontuur",
    "Eén voor allen, Allen voor Eén!",
    "Carpe diem",
  ];

  function getRandomMotto() {
    return randomMottos[Math.floor(Math.random() * (randomMottos.length - 1 - 0 + 1) + 0)];
  }
</script>

<div class="container pt-5 bg-gray-200">
  <div class="row">
    {#if !member && $memberQuery.loading}
      <Loading />
    {:else if $memberQuery.error}
      Oops hier ging iets fout 🫠
    {:else}
      <div class="col-md-4 mb-n9 z-index-1">
        <MemberCard {member} description={member?.meta?.memberMeta?.motto || getRandomMotto()}></MemberCard>
      </div>
    {/if}
  </div>
</div>
<section class="bg-gradient-dark position-relative overflow-hidden">
  <Wave fill="#e9ecef" down={true} />
  <img src="../../assets/img/shapes/waves-white.svg" class="position-absolute opacity-6 h-100 top-0 d-md-block d-none" alt="" />
  <div class="container pt-6 pb-5 position-relative">
    <div class="row mt-8">
      <div class="row">
        <div class="col-md-6 mx-auto text-center">
          <!-- <span class="badge badge-white text-dark mb-2">Over mij</span> -->
          <h2 class="text-white mb-3">{""}</h2>
          <h5 class="text-white font-weight-light">
            {""}
          </h5>
        </div>
      </div>
    </div>
  </div>
  <Wave fill="#fbfbfb" />
</section>

{#if member && $memberQuery.data}
  <div class="tw-p-4 tw-pb-0 tw-mb-0 tw-border-b-0 tw-rounded-t-2xl">
    <div class="tw-flex tw-flex-wrap tw--mx-3">
      <div class="tw-flex tw-items-center tw-w-full tw-max-w-full tw-px-3 tw-shrink-0 tw-md:tw-w-8/12 md:tw-flex-none">
        <!-- <h6 class="tw-mb-0 dark:tw-text-white">Profile Information</h6> -->
      </div>
      {#if $features?.members?.profileEdit && $currentSession.member._id === member?._id}
        <div class="tw-w-full tw-max-w-full tw-px-3 tw-text-right tw-shrink-0 tw-md:tw-w-4/12 md:tw-flex-none">
          <a href="javascript:;" data-target="tooltip_trigger">
            <i class="tw-leading-normal fas fa-user-edit tw-text-sm tw-text-slate-400 dark:tw-text-white dark:tw-opacity-80" aria-hidden="true" />
          </a>
        </div>
      {/if}
    </div>
  </div>
  <div class="tw-flex-auto tw-p-4">
    <p class="tw-leading-normal tw-text-sm dark:tw-text-white dark:tw-opacity-60">
      {member?.meta?.memberMeta?.description || ""}
    </p>
    <ul class="tw-flex tw-flex-col tw-pl-0 tw-mb-0 tw-rounded-lg">
      <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
        <strong class="tw-text-slate-700 dark:tw-text-white">Mobiel:</strong> &nbsp; <a href="tel:{member?.phone || ''}">{member?.phone || "-"}</a>
      </li>
      <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
        <strong class="tw-text-slate-700 dark:tw-text-white">Email:</strong> &nbsp;
        <a target="_blank" href="mailto:{member?.user?.email}">{member?.user?.email}</a>
      </li>
      <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
        <strong class="tw-text-slate-700 dark:tw-text-white">Geboortedatum:</strong> &nbsp; {#if member?.birthdate}
          {new Date(member?.birthdate).toLocaleDateString("nl-NL")} ({getAge(
          member?.birthdate
        )} jaar)
        {:else}
        -
        {/if}
      </li>
      <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
        <strong class="tw-text-slate-700 dark:tw-text-white">Lid sinds:</strong> &nbsp; {member?.meta?.memberMeta?.since || "-"}
      </li>
      <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
        <strong class="tw-text-slate-700 dark:tw-text-white">Jaargang:</strong> &nbsp; {member?.meta?.memberMeta?.group || "-"}
      </li>
      <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
        <strong class="tw-text-slate-700 dark:tw-text-white">Studierichting:</strong> &nbsp; {member?.meta?.study?.course || "-"}
        {#if member?.meta.study.year}({member?.meta.study.year}e jaar) op {/if}
        {member?.meta.study.school ? "| " + member?.meta.study.school : ""}
      </li>
      {#if member?.address[0]}
        <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
          <strong class="tw-text-slate-700 dark:tw-text-white">Adres:</strong>
          {member?.address[0].street}
          {member?.address[0].number}
          {member?.address[0].city}
        </li>
      {/if}
      {#if member?.address[1]}
        <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pl-0 tw-leading-normal tw-border-0 tw-border-t-0 tw-text-sm tw-text-inherit">
          <strong class="tw-text-slate-700 dark:tw-text-white">Adres weekend:</strong>
          {member?.address[1].street}
          {member?.address[1].number}
          {member?.address[1].city}
        </li>
      {/if}
      <!-- <li class="tw-relative tw-block tw-px-4 tw-py-2 tw-pb-0 tw-pl-0 tw-border-0 tw-border-t-0 tw-rounded-b-lg tw-text-inherit">
        <strong class="tw-leading-normal tw-text-sm tw-text-slate-700 dark:tw-text-white">Social:</strong> &nbsp;
        <a
          class="tw-inline-block tw-py-0 tw-pl-1 tw-pr-2 tw-mb-0 tw-font-bold tw-text-center tw-text-blue-800 tw-align-middle tw-transition-all tw-bg-transparent tw-border-0 tw-rounded-lg tw-shadow-none tw-cursor-pointer tw-leading-pro tw-text-xs tw-ease-soft-in tw-bg-none"
          href="javascript:;"
        >
          <i class="fab fa-facebook fa-lg" aria-hidden="true" />
        </a>
        <a
          class="tw-inline-block tw-py-0 tw-pl-1 tw-pr-2 tw-mb-0 tw-font-bold tw-text-center tw-align-middle tw-transition-all tw-bg-transparent tw-border-0 tw-rounded-lg tw-shadow-none tw-cursor-pointer tw-leading-pro tw-text-xs tw-ease-soft-in tw-bg-none tw-text-sky-600"
          href="javascript:;"
        >
          <i class="fab fa-twitter fa-lg" aria-hidden="true" />
        </a>
        <a
          class="tw-inline-block tw-py-0 tw-pl-1 tw-pr-2 tw-mb-0 tw-font-bold tw-text-center tw-align-middle tw-transition-all tw-bg-transparent tw-border-0 tw-rounded-lg tw-shadow-none tw-cursor-pointer tw-leading-pro tw-text-xs tw-ease-soft-in tw-bg-none tw-text-sky-900"
          href="javascript:;"
        >
          <i class="fab fa-instagram fa-lg" aria-hidden="true" />
        </a>
      </li> -->
    </ul>
  </div>
{/if}
