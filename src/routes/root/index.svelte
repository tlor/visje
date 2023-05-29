<script lang="ts">
  import EventList from "@root/events/index.svelte";
  import MessageList from "@root/posts/messages.svelte";
  import ContentLink from "@components/Posts/ContentLink.svelte";
  import LiveNow from "@root/events/live.svelte";
  import { notification } from "@root/_store";

  import { graphqlError } from "@utils/graphql";

  let events;
</script>

<div class="row">
  <section id="promotions" class="col-lg-7 tw-min-h-50" />
  <section id="messages" class="col-lg-7 tw-min-h-25">
    <MessageList on:error={(e) => graphqlError("Messages", e.detail)} />
  </section>
  <section id="live" class="col-lg-7 bg-gradient-primary position-relative overflow-hidden">
    <LiveNow event={events?.find(e=>e._id === "a0c75cee44837dacbeba74f3")} on:error={(e) => graphqlError("Live Events", e.detail)} />
  </section>
  <section id="events" class="col-lg-7 bg-gray-200 tw-min-h-screen">
    <EventList
      bind:events
      on:error={(e) => {
        notification.set({ type: "danger", content: "Error bij activiteiten:" + e.detail.message });
        graphqlError("Events", e.detail);
      }}
      on:update={(e) => notification.set({ type: "success", content: `${e.detail.title} succesvol aangepast` })}
    />
  </section>
  <div class="d-none d-lg-block col-lg-4 tw-ml-5">
    <!-- <div class="pt-1 pb-5 position-sticky top-1 mt-lg-8 mt-5">
      <h4 class="mt-5">Insides</h4>
      <ContentLink
        content={{
          title: "Inside 1",
          poster: "/assets/img/curved-images/curved11.jpg",
        }}
      />
      <ContentLink
        content={{
          title: "Inside 2",
          poster: "/assets/img/curved-images/curved9.jpg",
        }}
      />
      <ContentLink
        content={{
          title: "Inside 3",
          poster: "/assets/img/curved-images/curved8.jpg",
        }}
      />
    </div> -->
  </div>
</div>
