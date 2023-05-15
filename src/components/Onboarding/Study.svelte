<script lang="ts">
import Study from "@models/Study/Study";
export let study: Study = new Study();

</script>

<style>
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
.form-group:hover span i:before {
  box-shadow: 0 3px 8px 0 rgba(255, 255, 255, 0.2);
}

</style>

<div class="form-group">
  <div class="d-flex flex-column"><small class="text-light"> We hebben deze studierichting van je gevonden </small></div>

  <div class="input-group no-border input-lg">
    <input type="text" bind:value={study.course} class="form-control text-light" placeholder="Studierichting" />
    <div class="input-group-append">
      <span class="input-group-text text-light" id="basic-addon1"> <i class="now-ui-icons design-2_ruler-pencil md" /> </span>
    </div>
  </div>
  <small class="text-muted"> (Als je werkt vul je hier je werk in) </small>
  <div class="input-group no-border input-lg my-3">
    <input type="text" bind:value={study.school} class="form-control text-light" placeholder="Locatie" />
    <div class="input-group-append">
      <span class="input-group-text text-light" id="basic-addon1"> <i class="now-ui-icons business_bank md" /> </span>
    </div>
  </div>
  <div class="input-group no-border input-lg">
    <input type="number" bind:value={study.year} class="form-control text-light" placeholder="Studiejaar" />
    <div class="input-group-append">
      <span class="input-group-text text-light" id="basic-addon11"> <i class="now-ui-icons education_hat md" /> </span>
    </div>
  </div>
</div>
