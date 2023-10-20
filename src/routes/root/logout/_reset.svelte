<script>
  import { goto } from "@roxi/routify";
  import { session } from "@root/_store";
  function logout() {
    // TODO: Move to utils
    $session.invalidate();
    console.log("logged out");
    localStorage.removeItem("user"); // Remove user from local storage to undo any onboarding
    $goto("/login");
  }
  logout();
</script>
