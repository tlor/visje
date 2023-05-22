<script lang="ts">
  import EventList from "@root/events/index.svelte";
  import MessageList from "@root/posts/messages.svelte";
  import ContentLink from "@components/Posts/ContentLink.svelte";
</script>

<div class="row">
  <section id="promotions" class="col-lg-7 tw-min-h-50">
    
  </section>
  <section id="messages" class="col-lg-7 tw-min-h-25">
    <MessageList on:error={() => console.log("error")} />
  </section>
  <section id="live" class="col-lg-7">
    
  </section>
  <section id="events" class="col-lg-7 bg-gray-200 tw-min-h-screen">
    <EventList on:error={() => console.log("error")} />
  </section>
  <div class="d-none d-lg-block col-lg-4 tw-ml-5">
    <div class="pt-1 pb-5 position-sticky top-1 mt-lg-8 mt-5">
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
    </div>
  </div>
</div>
