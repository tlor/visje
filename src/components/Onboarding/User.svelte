<script>
export let username,
  password = "",
  disableUserField = false,
  showPasswordField = false,
  error;
import z from "zxcvbn";
import {fade} from "svelte/transition";
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

<div class="form-group">
  {#if error}<small transition:fade class="form-text text-muted">{error?.message}</small>{/if}
  <small class="text-light"> Geef een unieke gebruikersnaam op om mee in te loggen </small>
  <div class="input-group no-border input-lg">
    <div class="input-group-prepend"><span class="input-group-text text-light"> @ </span></div>
    <input
      type="text"
      bind:value={username}
      class="form-control text-light"
      id="inlineFormInputGroup"
      placeholder="Gebruikersnaam"
      disabled={disableUserField}
    />
    <div class="input-group-append"><span class="input-group-text text-light"> <i class="now-ui-icons users_single-02 md" /> </span></div>
  </div>
</div>
{#if showPasswordField}
  <div class="form-group">
    <small class="text-light"> Geef een veilig wachtwoord op </small>
    <div class="input-group no-border input-lg">
      <input type="password" bind:value={password} class="form-control text-light" id="inlineFormInputGroup1" placeholder="Wachtwoord" />
      <div class="input-group-append"><span class="input-group-text text-light"> <i class="now-ui-icons objects_key-25 md" /> </span></div>
    </div>
  </div>
  <small class="text-light">Wachtwoordsterkte: {passwordStrengthNames[score]}</small>
{/if}

<div class="form-group"><small> Volg de stappen om je profiel te voltooien </small></div>
