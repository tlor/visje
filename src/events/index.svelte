<script context="module">
  import Event from "@components/Events/Event.svelte";
  import EditEvent from "@components/Events/EditEvent.svelte";
  import Loading from "@components/Elements/Loading.svelte";
  import Filters from "@components/Elements/Filters.svelte";
</script>

<script>
  import { isAuthor } from "@services/roles";
  import { createEventDispatcher } from "svelte";
  import { eventMany } from "./event.gql";
  import { stripResult, prepareModel } from "@utils/gql";
  import { query, mutation } from "svelte-apollo";
  import { currentSession, session } from "@root/_store";
  import { writable } from "svelte/store";
  import { goto, params, url } from "@roxi/routify";
  import { eventUpdateById } from "@models/Event/event.gql";
  import { agendaItemCreateOne, agendaItemUpdateById, agendaItemRemoveById } from "@models/AgendaItem/agendaItem.gql";
  import { stripHtml } from "string-strip-html";
  import { features } from "@root/_store";

  export let active;

  const isActive = (id) => `#${id}` === active;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  export let filter = {
    _operators: { to: { gt: today.toISOString() } },
  };

  const dispatch = createEventDispatcher();
  export let events = [];
  let filteredEvents = [];
  const eventsQuery = query(eventMany, {
    variables: { filter },
    fetchPolicy: "network-only",
  });

  const eventUpdateQuery = mutation(eventUpdateById);
  const agendaItemCreateQuery = mutation(agendaItemCreateOne);
  const agendaItemRemoveQuery = mutation(agendaItemRemoveById);
  const agendaItemUpdateQuery = mutation(agendaItemUpdateById);

  export const update = async (event) => {
    const { poster, title, content, agenda, location } = $editEvent;
    event.poster = poster;
    event.title = stripHtml(title).result;
    event.content = content;
    event.location = location?._id ? location._id : null;
    let agendaIds = agenda.map(item => item?._id);
    // In case an item, is removed reset indexes
    if(agendaIds.length !== event.agenda.length){
      for (const [i, item] of agenda.entries()) {
          item.index = i;
      }
      agenda.forEach((item) => {
        // Remove agenda item
        if(!agendaIds.includes(item?._id)) {
          return agendaItemRemoveQuery({ 
            variables: { id: item._id },
          }).catch((err) => dispatch("error", err));
        }
      })
    }
    const agendaItems = await Promise.all(
      agenda.map((item) => {
        item.time = Number(item.time);
        item.title = stripHtml(item.title).result;
        // Update/Create agenda item
        if (!item?._id) {          
          return agendaItemCreateQuery({
            variables: { record: prepareModel(item) },
          }).catch((err) => dispatch("error", err));
        } else {
          return agendaItemUpdateQuery({
            variables: { id: item._id, record: prepareModel(item) },
          }).catch((err) => dispatch("error", err));
        }
      }),
    );
    agendaIds = agendaItems.map((res) => stripResult(res.data).recordId);
    const result = await eventUpdateQuery({
      variables: { id: event._id, record: prepareModel({...event, agenda: agendaIds}) },
    })
      .then((res) => {
        event.agenda = agenda.map((item, index) => {
          item._id = agendaIds[index];
          return item
        });
        event.location = location;
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

  $: if ($eventsQuery.data) {
    if (!events?.length) events = stripResult($eventsQuery.data);
    filteredEvents = events;
  } else if ($eventsQuery.error) {
    dispatch("error", $eventsQuery.error);
  }

  let activeFilters = [];

  function filterEvents() {
    if (activeFilters.length) {
      filteredEvents = events.filter((e) => {
        if (activeFilters.includes("overig")) return activeFilters.includes(e.type) || e.type === null;
        return activeFilters.includes(e.type);
      });
    } else {
      filteredEvents = events;
    }
  }

  $: if (editEventModalElement) {
    editEventModal = new bootstrap.Modal(editEventModalElement);
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
      <div class="tw-mb-4 tw-flex tw-justify-center">
        <Filters
          items={{
            kring: { text: "Kring" },
            extern: { text: "Extern" },
            activity: { text: "Activiteit" },
            overig: { text: "Overig" },
          }}
          bind:activeFilters
          on:change={filterEvents}
        />
      </div>
      {#each filteredEvents as event, index}
        <div class="py-2">
          <!-- {#if event.type?.match(/kring/) || event.tags?.match(/Incasso|incasso/)} -->
          {#if $editEvent?._id == event._id}
            <div class="py-2">
              <EditEvent
                event={$editEvent}
                on:save={() => update(event)}
                on:close={close}
                features={$features?.events.edit.features}
                notify={event.type === "kring" ? "Deze activiteit is alleen van jouw eigen kring" : ""}
              />
            </div>
          {:else}
            <Event
              {event}
              i={index}
              active={isActive(event._id)}
              author={isAuthor(event, $currentSession, session)}
              on:navigateGroup={(e) => $goto(`/groepen/@[groupname]`, { groupname: e.detail })}
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
