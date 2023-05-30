<script lang="ts" context="module">
  import LiveEvent from "@components/Events/LiveEvent.svelte";
</script>

<script lang="ts">
  import { isAuthor } from "@services/roles";
  import { createEventDispatcher } from "svelte";
  import { eventById } from "@models/Event/event.gql";
  import { liveEvent, liveEventUpdateIndex } from "./event.gql";
  import { query, mutation } from "svelte-apollo";
  import { stripResult } from "@root/utils/gql";
  import { currentSession, session } from "@root/_store";
  export let event = undefined;
  export let eventId = undefined;
  import { onMount } from "svelte";
  import { pusher, pushService } from "@root/_store";

  const dispatch = createEventDispatcher();

  let pushChannel;
  let isAuthorOfEvent;
  let activeIndex: number = 0;
  let initialized = false;
  let liveEventUpdateQuery;

  const liveEventQuery = query(liveEvent, {
      fetchPolicy: "network-only",
    });

  $: if ($liveEventQuery.data) {
    const result = stripResult($liveEventQuery.data)
    if (result) {      
      eventId = result.id;
      if(typeof result.activeIndex === "number") activeIndex = result.activeIndex;
    }
  } else if ($liveEventQuery.error) {
    dispatch("error", $liveEventQuery.error);
  }

  onMount(() => {
    pusher.then((push) => {
      pushChannel = push.subscribe("live-event");
      pushChannel.bind("update", function (data) {
        if (event?.agenda && data.activeIndex < event.agenda.length && typeof data.activeIndex === "number") activeIndex = data.activeIndex;
      });
    });
  });

  $: if (isAuthorOfEvent) {
    liveEventUpdateQuery = query(liveEventUpdateIndex, {
      variables: { input: { id: event?._id, activeIndex, socket_id: pushService.socketId } },
      fetchPolicy: "network-only",
    });
  }

  $: if (event) isAuthorOfEvent = isAuthor(event, $currentSession, session);

  $: if (isAuthorOfEvent && typeof activeIndex === "number") {
    if (initialized) {
      liveEventUpdateQuery
        .refetch({ input: { id: event?._id, activeIndex, socket_id: pushService.socketId } })
        .catch((err) => dispatch("error", err))
        .then((res) => {
          dispatch("update", {
            title: event?.agenda?.find((e) => e.index === activeIndex)?.title,
          });
          close();
        });
    } else {
      initialized = true;
    }
    // console.log("Trigger update")
    // pushChannel.trigger("client-update", {activeIndex})
  }

  // const eventQuery = query(eventById, {
  //   variables: { id: "a0c75cee44837dacbeba74f3" }, // 595e02487f87db7a21a6dd19 ALV 4
  //   fetchPolicy: "network-only",
  // });

  // $: if ($eventQuery.data) {
  //   if (!event) {
  //     event = stripResult($eventQuery.data);
  //     let i = 0;
  //   }
  // } else if ($eventQuery.error) {
  //   dispatch("error", $eventQuery.error);
  // }
</script>

{#if event}
  <div class="position-absolute w-100 z-index-1 top-0 mt-1 tw-transform tw-scale-y-[-1]">
    <div class="w-full absolute bottom-0 start-0 end-0" style="transform: scale(2);transform-origin: top center;color: #fbfbfb;">
      <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor" />
      </svg>
    </div>
  </div>
  <div class="container pt-6 pb-7">
    <div class="row">
      <div class="col-md-4 col-lg-8 mx-auto">
        <LiveEvent {event} author={isAuthorOfEvent} {activeIndex} on:update={(e) => (activeIndex = e.detail)} />
      </div>
    </div>
  </div>
  <div class="position-absolute w-100 z-index-1 bottom-0 mb-1">
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 40"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </defs>
      <g class="moving-waves">
        <use xlink:href="#gentle-wave" x="48" y="-1" fill="rgba(251,251,251,0.40" />
        <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(251,251,251,0.35)" />
        <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(251,251,251,0.25)" />
        <use xlink:href="#gentle-wave" x="48" y="8" fill="rgba(251,251,251,0.20)" />
        <use xlink:href="#gentle-wave" x="48" y="13" fill="rgba(251,251,251,0.15)" />
        <use xlink:href="#gentle-wave" x="48" y="16" fill="rgba(233, 236, 239,1)" />
      </g>
    </svg>
  </div>
{/if}
