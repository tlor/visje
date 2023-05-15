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
    <div class="input-group">
      <span class="input-group-text text-light">
        <i class="now-ui-icons users_single-02 md" />
      </span>
      <input
        data-test="username"
        type="text"
        bind:value={username}
        class="form-control text-light"
        placeholder="Gebruikersnaam of E-mail"
      />
    </div>
  </div>
{/if}
