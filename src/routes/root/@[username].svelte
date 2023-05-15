<script>
  import Wave from "@components/Layout/Wave.svelte";
  import { memberById, memberFilterOne } from "@models/Member/member.gql";
  import { stripResult } from "@utils/gql";
  import { query } from "svelte-apollo";
  import Loading from "@components/Elements/Loading.svelte";
  import { currentSession } from "@root/_store";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let username;
  let member;

  export let id = username.length === 24 ? username : "";

  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  const memberQuery = id
    ? query(memberById, { variables: { id: id } })
    : query(memberFilterOne, { variables: { filter: { username } } });

  $: if ($memberQuery.data) {
    member = stripResult($memberQuery.data);
  } else if ($memberQuery.error) {
    dispatch("error", { message: $memberQuery.error.message, type: "Member" });
  }

  $: if(username && member) {
    memberQuery.refetch({ filter: { username } })
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
    return randomMottos[
      Math.floor(Math.random() * (randomMottos.length - 1 - 0 + 1) + 0)
    ];
  }
</script>

<div class="container pt-5 bg-gray-200">
  <div class="row">
    {#if !member && $memberQuery.loading}
      <Loading />
    {:else if $memberQuery.error}
      ERROR
    {:else}
      <div class="col-md-4 mb-n9 z-index-1">
        <div class="card w-100 mt-5 text-right">
          {#if $currentSession.member._id === member._id}
            <div class="tw-absolute tw-w-full tw-text-right tw-p-3">
              <a href="javascript:;">
                <i
                  class="leading-normal fas fa-user-edit text-sm text-slate-400 dark:text-white dark:opacity-80"
                />
              </a>
            </div>
          {/if}
          <div class="text-center mt-n5">
            <div class="position-relative">
              <div class="blur-shadow-avatar">
                <img
                  class="avatar avatar-xxl shadow-lg"
                  src={member?.user?.avatar}
                  alt="profielfoto {member.name}"
                />
              </div>
            </div>
          </div>
          <div class="card-body text-center pb-0">
            <h4 class="mb-0">{member.fullName}</h4>
            {#if member?.user?.username}
              <a class="mb-0 text-xs font-weight-bolder text-warning text-gradient text-uppercase" href="@{member.user.username}">@{member.user.username}</a>
            {/if}
            <p class="mt-2">
              {member?.meta?.memberMeta?.motto || getRandomMotto()}
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
<section class="bg-gradient-dark position-relative overflow-hidden">
  <Wave fill="#e9ecef" down={true} />
  <img
    src="../../assets/img/shapes/waves-white.svg"
    class="position-absolute opacity-6 h-100 top-0 d-md-block d-none"
    alt=""
  />
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
