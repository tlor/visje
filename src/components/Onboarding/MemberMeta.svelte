<script lang="ts">
import MemberMeta from "@models/MemberMeta/MemberMeta";
export let memberMeta: MemberMeta;
</script>

<style>
.login-btn i {
  transform: translate(10%, 10%);
}
.form-control.text-light::placeholder,
select.form-control option:first-child {
  color: #9a9a9a;
}

.form-control.text-light:focus::placeholder,
select.form-control:focus option:first-child {
  color: transparent;
}

.input-group-text.text-light {
  background: unset;
}

.input-group:hover,
.form-group:hover span i:before,
.btn.btn-light:not(:disabled):hover {
  box-shadow: 0 3px 8px 0 rgba(255, 255, 255, 0.2);
}
.gradient-overlay {
  background-color: #390020;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpolygon fill='%23440227' points='800 100 0 200 0 800 1600 800 1600 200'/%3E%3Cpolygon fill='%234e042e' points='800 200 0 400 0 800 1600 800 1600 400'/%3E%3Cpolygon fill='%23580735' points='800 300 0 600 0 800 1600 800 1600 600'/%3E%3Cpolygon fill='%23610b3c' points='1600 800 800 400 0 800'/%3E%3Cpolygon fill='%236a0f43' points='1280 800 800 500 320 800'/%3E%3Cpolygon fill='%23721449' points='533.3 800 1066.7 800 800 600'/%3E%3Cpolygon fill='%23791950' points='684.1 800 914.3 800 800 700'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-position: 50%;
  background-size: cover;
}

.login .row {
  z-index: 1;
}
</style>

<div class="form-group">
  <div class="d-flex flex-column"><small class="text-light">We missen nog de volgende informatie van je</small></div>

  <div class="input-group no-border input-lg my-3">
    <!-- TODO: date picker && check -->
    <input type="date" bind:value={memberMeta.since} class="form-control text-light" placeholder="Datum lidmaatschap" />
    <div class="input-group-append">
      <span class="input-group-text text-light" id="basic-addon1"><i class="now-ui-icons ui-1_calendar-60 md" /></span>
    </div>
  </div>
  <small class="text-muted">(De volgende velden zijn optioneel, je kan ze in 'mijn profiel' altijd nog vullen)</small>

  <div class="input-group no-border input-lg my-2">
    <input type="text" bind:value={memberMeta.motto} class="form-control text-light" placeholder="Jouw motto" />
    <div class="input-group-append"><span class="input-group-text text-light"><i class="now-ui-icons ui-2_chat-round md" /></span></div>
  </div>
  <!-- <div class="input-group no-border input-lg mt-2">
    <textarea bind:value={memberMeta.description} class="form-control text-light" placeholder="Even voorstellen..." rows="3" />
  </div> -->
</div>
