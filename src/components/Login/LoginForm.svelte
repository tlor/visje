<script>
  import { fade } from "svelte/transition";
  export let username, password, error;
</script>

<div class="form-group">
  {#if error}<small
      transition:fade={{ delay: 1000 }}
      class="form-text text-muted">{error.message}</small
    >{/if}

  <div class="input-group">
    <span class="input-group-text text-light">
      <i class="now-ui-icons users_single-02 md" />
    </span>
    <input
      data-test="username"
      type="text"
      bind:value={username}
      class="form-control text-light"
      placeholder="Gebruikersnaam"
    />
  </div>
</div>
<div class="form-group">
  <div class="input-group">
    <span class="input-group-text text-light">
      <i class="now-ui-icons objects_key-25 md" />
    </span>
    <input
      data-test="password"
      type="password"
      bind:value={password}
      class="form-control text-light"
      placeholder="Wachtwoord"
    />
  </div>
</div>
