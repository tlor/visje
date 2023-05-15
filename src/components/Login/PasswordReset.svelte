<script>
export let username,
  success = false;

</script>

{#if success}
  <div class="form-group">
    <p class="mb-1">Verstuurd! 🐱‍🏍</p>
    <small href=""> Check je inbox om je wachtwoord te resetten </small>
  </div>
{:else}
  <div class="form-group">
    <div class="input-group no-border input-lg">
      <input
        type="text"
        bind:value={username}
        class="form-control text-light"
        id="inlineFormInputGroup"
        placeholder="Gebruikersnaam of e-mail"
      />
      <div class="input-group-append">
        <span class="input-group-text text-light" id="basic-addon1"> <i class="now-ui-icons users_single-02 md" /> </span>
      </div>
    </div>
  </div>
{/if}
