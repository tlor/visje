<script context="module">
  import Event from "@components/Events/Event.svelte";
  import EditEvent from "@components/Events/EditEvent.svelte";
  import Loading from "@components/Elements/Loading.svelte";
</script>

<script>
  import { isAuthor } from "@services/roles";
  import { createEventDispatcher } from "svelte";
  import { eventMany } from "./event.gql";
  import { stripResult, prepareModel } from "@utils/gql";
  import { query, mutation } from "svelte-apollo";
  import { currentSession, session } from "@root/_store";
  import { writable } from "svelte/store";
  import { goto} from "@roxi/routify"
  import { eventUpdateById } from "@models/Event/event.gql";
  import { agendaItemCreateOne, agendaItemUpdateById } from "@models/AgendaItem/agendaItem.gql";
  import { stripHtml } from "string-strip-html";

  const today = new Date()
  today.setHours(0,0,0,0)

  export let filter = {
     "_operators": { "from": {"gt": today.toISOString() }}
  };

  const dispatch = createEventDispatcher();
  export let events = [];
  const eventsQuery = query(eventMany, {
    variables: { filter, limit: 5 },
    fetchPolicy: "network-only",
  });

  const eventUpdateQuery = mutation(eventUpdateById);
  const agendaItemCreateQuery = mutation(agendaItemCreateOne);
  const agendaItemUpdateQuery = mutation(agendaItemUpdateById);

  export const update = async (event) => {
    const { poster, title, content, agenda, location } = $editEvent;
    event.poster = poster;
    event.title = stripHtml(title).result;
    event.content = content;
    if(location) event.location = location._id;
    const agendaItems = await Promise.all(
      agenda.map((item) => {
        item.time = Number(item.time);
        item.title = stripHtml(item.title).result
        if (!item?._id) {
          return agendaItemCreateQuery({
            variables: { record: prepareModel(item) },
          }).catch((err) => dispatch("error", err));
        } else {
          return agendaItemUpdateQuery({
            variables: { id: item._id, record: prepareModel(item) },
          }).catch((err) => dispatch("error", err));
        }
      })
    );
    event.agenda = agendaItems.map((res) => stripResult(res.data).recordId);
    const result = await eventUpdateQuery({
      variables: { id: event._id, record: prepareModel(event) },
    })
      .then((res) => {
        event.agenda = agenda
        event.location = location
        dispatch("update", {
          id: stripResult(res.data).recordId,
          title: event.title,
        });
        close();
      })
      .catch((err) => dispatch("error", err));
  };

  const close = () => editEvent.set({});

  let editEvent = writable({});
  let editEventModalElement;
  let editEventModal;

  $: if (editEventModalElement) {
    editEventModal = new bootstrap.Modal(editEventModalElement);
  }

  $: if ($eventsQuery.data) {
    if (!events?.length) events = stripResult($eventsQuery.data);  
    eventsQuery.refetch({ limit: 200 });
  } else if ($eventsQuery.error) {
    dispatch("error", $eventsQuery.error);
  }
</script>

<div class="container">
  <div class="row">
    <div class="col me-auto text-start">
      {#if $eventsQuery.loading}{:else if $eventsQuery.error}
        <span>Foei.. geen <b>activiteiten</b> gevonden 🫠</span>
      {:else}
        <p />
      {/if}
    </div>
  </div>
  <div class="row mt-lg-4 mt-2">
    {#if $eventsQuery.loading}
      <Loading />
    {:else if $eventsQuery.data}
      {#each events as event, index}
        <div class="py-2">
          <!-- {#if event.type?.match(/kring/) || event.tags?.match(/Incasso|incasso/)} -->
          {#if $editEvent?._id == event._id}
            <div class="py-2">
              <EditEvent event={$editEvent} on:save={() => update(event)} on:close={close} notify={event.type === "kring" ? "Deze activiteit is alleen van jouw eigen kring" : ""} />
            </div>
          {:else}
            <Event
              {event}
              i={index}
              author={isAuthor(event, $currentSession, session)}
              on:navigateGroup={(e)=> $goto(`/groepen/@[groupname]`, { groupname: e.detail})}
              on:edit={({ detail }) => {
                editEvent.set({ ...detail });
                // editEventModal.show();
              }}
            />
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<!-- <div
  class="modal"
  id="eventModal"
  bind:this={editEventModalElement}
  tabindex="-1"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{$editEvent.title}</h5>
        <button type="button" class="btn-close text-dark" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

      </div>
      <div class="modal-footer justify-content-between">
        <button
          type="button"
          class="btn bg-gradient-dark"
          data-bs-dismiss="modal">Close</button
        >
        <button type="button" class="btn bg-gradient-primary"
          >Save changes</button
        >
      </div>
    </div>
  </div>
</div> -->
