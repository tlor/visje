<script>
export let groups = [],
  message = "";

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
    <div class="my-2">
      <ul class="list-group text-dark">
        {#each groups as group}
          <li
            class="list-group-item d-flex flex-column align-items-start"
            style={group.meta?.color ? `background-color: ${group.meta?.color}` : ''}
          >
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-0">{group.name}</h6>
              <i class="now-ui-icons icon {group.meta?.icon ? group.meta?.icon : 'icon-network'} lg" />
            </div>
            <!-- TODO: role in groep <small> {group.role}</small> -->
          </li>
        {:else}<small class="text-light"> Sorry we hebben je niet automatisch kunnen koppelen aan een groep</small>{/each}
      </ul>
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
