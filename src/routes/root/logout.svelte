<script>
  import { goto } from "@roxi/routify";
  import { session } from "@root/_store";
  function logout() {
    // TODO: Move to utils
    $session.invalidate();
    console.log("logged out");
    $goto("./", {});
  }
  logout();
</script>
