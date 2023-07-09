<script>
export let groups = [],
member,
  message = "";
import GroupTable from "@components/Groups/GroupTable.svelte"
</script>

<style>
.form-control.text-light::placeholder {
  color: #9a9a9a; /* .text-muted */
}

.form-control.text-light:focus::placeholder {
  color: transparent;
}

.input-group:hover,
.form-group:hover span i:before {
  box-shadow: 0 3px 8px 0 rgba(255, 255, 255, 0.2);
}

</style>

<div class="form-group">
  <div class="d-flex flex-column">
    {#if groups.length}<small class="text-light"> We hebben je automatisch in deze groepen geplaats </small>{/if}
          <div
        class="tw-mt-4 tw-relative tw-flex tw-flex-col tw-min-w-0 tw-mb-6 tw-break-words tw-bg-white tw-border-0 dark:tw-bg-gray-950 dark:tw-shadow-soft-dark-xl tw-shadow-soft-xl tw-rounded-2xl tw-bg-clip-border"
      >
        <GroupTable {groups} memberID={member?.id}></GroupTable>
    </div>
  </div>
  <div class="input-group no-border input-lg mt-2">
    <textarea
      bind:value={message}
      class="form-control text-light"
      placeholder={groups.length ? 'Klopt er iets niet? Laat het hier weten dan gaan we er mee aan de slag!' : 'Laat ons weten in welke groepen je zit, je kring, familie en commissies'}
      rows="3"
    />
  </div>
</div>
