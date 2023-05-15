<script lang="ts">
  import { currentSession } from "@root/_store";

  const user = $currentSession.user;
</script>

Wijzig je persoonlijke gegevens op je <a
  class=""
  href="/@{user.username || user._id}"
  title="Naar profiel">profiel</a
>
