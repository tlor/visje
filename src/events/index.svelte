<script context="module">
  import Event from "@components/Events/Event.svelte";
  import EditEvent from "@components/Events/EditEvent.svelte";
  import Loading from "@components/Elements/Loading.svelte";
</script>

<script>
  import { isAuthor } from "@libs/services/roles";
  import { createEventDispatcher } from "svelte";
  import * as eases from "svelte/easing";
  import { eventMany } from "./event.gql";
  import { stripResult, prepareModel } from "@utils/gql";
  import { query, mutation } from "svelte-apollo";
  import { currentSession, session } from "@root/_store";
  import { writable } from "svelte/store";
  import { eventUpdateById } from "@models/Event/event.gql";
  import { stripHtml } from "string-strip-html";

  export let filter = {};

  const dispatch = createEventDispatcher();
  export let events = [];
  const eventsQuery = query(eventMany, {
    variables: { filter },
    fetchPolicy: "network-only",
  });

  const eventUpdateQuery = mutation(eventUpdateById);

  export const update = async (event) => {
    const {poster, title, content} = $editEvent
    event.poster = poster;
    event.title = stripHtml(title).result;
    event.content = content;
    const result = await eventUpdateQuery({
      variables: { record: prepareModel(event) },
    }).catch((err) => dispatch("error", err));
    dispatch("update", {
      id: stripResult(result.data).recordId,
      type: "Event",
    });
    close();
    return result;
  };

  const close = () => editEvent.set({});

  const expand = (node, { id }) => {
    function get_state(node) {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const transform_origin = style.transformOrigin.split(" ").map(parseFloat);
      const cx = rect.left + transform_origin[0];
      const cy = rect.top + transform_origin[1];

      const brad = [
        parse_brad(style.borderTopLeftRadius, rect),
        parse_brad(style.borderTopRightRadius, rect),
        parse_brad(style.borderBottomRightRadius, rect),
        parse_brad(style.borderBottomLeftRadius, rect),
      ];

      const border = [
        parseFloat(style.borderTopWidth),
        parseFloat(style.borderRightWidth),
        parseFloat(style.borderBottomWidth),
        parseFloat(style.borderLeftWidth),
      ];

      return { cx, cy, rect, brad, border };
    }

    const source = get_state(document.querySelector(`[data-id="${id}"]`));
    const target = get_state(node);

    return {
      duration: 400,
      easing: eases.quintInOut,
      css: (t, u) => {
        const tx = u * (source.cx - target.cx);
        const ty = u * (source.cy - target.cy);
        const translate = `translate(${tx}px,${ty}px)`;

        const sx = t + (u * source.rect.width) / target.rect.width;
        const sy = t + (u * source.rect.height) / target.rect.height;
        const scale = `scale(${sx},${sy})`;

        const brad_x_source = source.brad.map((a) => a[0]);
        const brad_x_target = target.brad.map((a) => a[0]);
        const brad_x = brad_x_source.map((source, i) => {
          const target = brad_x_target[i];
          return `${(target + u * (source - target)) / sx}px`;
        });

        const brad_y_source = source.brad.map((a) => a[1]);
        const brad_y_target = target.brad.map((a) => a[1]);
        const brad_y = brad_x_source.map((source, i) => {
          const target = brad_y_target[i];
          return `${(target + u * (source - target)) / sy}px`;
        });

        const brad = `${brad_x.join(" ")} / ${brad_y.join(" ")}`;

        const target_border = target.border;
        const border = source.border
          .map((source, i) => {
            const target = target_border[i];
            const s = i % 2 ? sy : sx;
            return `${(target + u * (source - target)) / s}px`;
          })
          .join(" ");

        return `transform: ${translate} ${scale}; border-radius: ${brad}; border-width: ${border}`;
      },
    };
  };

  let editEvent = writable({});
  let editEventModalElement;
  let editEventModal;

  $: if (editEventModalElement) {
    editEventModal = new bootstrap.Modal(editEventModalElement);
  }

  $: if ($eventsQuery.data) {
    if (!events?.length) {
      events = stripResult($eventsQuery.data);
      let i = 0;
      while (i < events.length) {
        let event = events[i];

        if (
          (event.to != null && new Date(event.to) < new Date()) ||
          (event.to == null && new Date(event.from) < new Date())
        ) {
          events.splice(i, 1);
        } else {
          i++;
        }
      }

      events.sort(function (a, b) {
        return new Date(a.from) - new Date(b.from);
      });
    }
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
        {#each events as event}
          <div class="py-2">
            <!-- {#if event.type?.match(/kring/) || event.tags?.match(/Incasso|incasso/)} -->
            {#if $editEvent?._id == event._id}
              <div class="py-2">
                <!-- <div  transition:expand={{}}> -->
                <EditEvent
                  event={$editEvent}
                  on:save={() => update(event)}
                  on:close={close}
                />
              </div>
            {:else}
              <Event
                {event}
                author={isAuthor(event, $currentSession, session)}
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
