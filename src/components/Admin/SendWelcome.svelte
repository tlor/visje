<script>
import SelectUser from "@components-local/Members/SelectUser.svelte";
import { query } from "svelte-apollo";
import { gql } from "@apollo/client/core";
import { goto} from "@roxi/routify";
 import { notification } from "@root/_store";

let userId, users = [],
  welcome = true;

const submitQuery = query(
  gql`
    query sendResetMail($input: MailInput) {
      sendResetMail(input: $input) {
        success
      }
    }
  `,
  { variables: { input: { id: userId, welcome } } }
);

async function submit() {  
  for (const user of users) {
    console.log("submitting", user.displayName);
    submitQuery.refetch({ input: { id: user._id, welcome } }).then(r => notification.set({ type: r?.data?.sendResetMail?.success ? "success" : "info", content: `${user.displayName} ${r?.data?.sendResetMail?.success} ${r?.data?.sendResetMail?.success ? "succesvol verzonden" : "niet verzonden"}` }).catch(e => notification.set({ type: "danger", content: "Error bij verzenden:" + e.detail.message })));
  }
}
function goBack() {
  $goto("/admin");
}
</script>

<div class="col-md-6">
  <div class="card ">
    <div class="card-header ">
      <button on:click={goBack} class="close" data-dismiss="modal" aria-hidden="true">
        <i class="now-ui-icons ui-1_simple-remove" />
      </button>
      <h4 class="card-title">Send reset/welcome mail</h4>
    </div>
    <div class="card-body ">
      <form method="#" action="#">
        <SelectUser bind:selectedusers={users} />
        <div class="form-check mt-3">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" bind:checked={welcome} />
            <span class="form-check-sign" />
            Welcome
          </label>
        </div>
      </form>
    </div>
    <div class="card-footer "><button disabled={!users.length} on:click={submit} class="btn btn-fill btn-primary">Submit</button></div>
  </div>
</div>
