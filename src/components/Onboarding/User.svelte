<script>
export let username,
  password = "",
  disableUserField = false,
  showPasswordField = false,
  error;
import z from "zxcvbn";
import {fade} from "svelte/transition";

let usernamePreExisted = !!username;

$: score = z(password).score;
const passwordStrengthNames = {
  0: "Erg zwak",
  1: "Zwak",
  2: "Matig",
  3: "Goed",
  4: "Sterk",
};
// TODO: implement disabled button on weak password
// TODO: implement visualization of password strength

</script>

<style>
.form-control.text-light::placeholder {
  color: #9a9a9a; /* .text-muted */
}

.form-control.text-light:focus::placeholder {
  color: transparent;
}

.input-group-text.text-light {
  background: unset;
}

.input-group:hover,
.form-group:hover span i:before {
  box-shadow: 0 3px 8px 0 rgba(255, 255, 255, 0.2);
}

</style>

{#if error}<small transition:fade class="form-text text-muted">{error?.message}</small>{/if}
  <small class="text-light"> {#if usernamePreExisted}
    Je gebruikersnaam is
  {:else}
    Geef een unieke gebruikersnaam op om mee in te loggen
  {/if}  </small>
<div class="form-group">
  <div class="input-group">
    <span class="input-group-text text-light"><i class="ni ni-at-sign" /></span>
    <input
      type="text"
      bind:value={username}
      class="form-control text-light"
      placeholder="Gebruikersnaam"
      disabled={disableUserField}
    />
  </div>
</div>
{#if showPasswordField}<small class="text-light"> Geef een veilig wachtwoord op </small>
  <div class="form-group">
    <div class="input-group">    
      <span class="input-group-text text-light">
        <i class="ni ni-key" />
      </span>
      <input type="password" bind:value={password} class="form-control text-light" placeholder="Wachtwoord" />
    </div>
    <small class="text-light">Wachtwoordsterkte: {passwordStrengthNames[score]}</small>
  </div>
  
{/if}

<div class="form-group"><small> Volg de stappen om je profiel te voltooien </small></div>
