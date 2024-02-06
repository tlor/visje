<script>
  import { goto, params } from "@roxi/routify";
  import { fade, scale } from "svelte/transition";
  import { login, resetPassword } from "@endpoints/login.gql";
  import { mutation, query } from "svelte-apollo";
  import { session } from "@root/_store";
  import LoginForm from "@components-local/Login/LoginForm.svelte";
  import PasswordReset from "@components-local/Login/PasswordReset.svelte";
  import LandingPageButton from "@components-local/_elements/LandingButton.svelte";

  export let context

  let username, password, error, success, delay = 1000;
  let waiting = false;
  let passwordReset = $params.reset ? true : false;

  const loginQuery = query(login);
  const resetPasswordMutation = mutation(resetPassword)

  const submit = async () => {
    waiting = true;
    if (passwordReset) {
      await resetPasswordMutation({
        variables: { input: { email: username.toLowerCase() } },
      })
        .catch((err) => {
          waiting = false;
          error = err.message;
        })
        .then((result) => {
          if (result?.data) {
            waiting = false;
            delay = 5000
            success = true;
            error = result.data.resetPassword.success
            const animateBacktoLogin = setTimeout(() => {
              passwordReset = false
              delay = 1000;
              clearTimeout(animateBacktoLogin);
            }, 5000);            
          }
        });
    } else {
      await loginQuery
        .refetch({ input: { user: username.toLowerCase(), password } })
        .catch((err) => {
          waiting = false;
          const result = err.graphQLErrors[0]?.extensions;
          if (result?.code === "I_USER_ONBOARDING") {
            $session.update(result);
            $session.save();
            if (location.pathname === "/onboarding") {
              window.location.reload();
            } else {
              $goto("/onboarding");
            }
          } else {
            error = err;
          }
        })
        .then((result) => {
          if (result) {
            if(result.data.login.user.password === null) delete result.data.login.user.password;
            $session.update(result.data.login);
            $session.save();
            if (location.pathname === "/") {
              window.location.reload();
            } else if (context.route.sourceUrl.hash){
              console.log("logging in, redirect back to:", context.route.sourceUrl.hash)
              window.location.href = "/" + context.route.sourceUrl.hash
            } else if ($params.url){
              console.log("logging in, redirect back to:", $params.url)
              window.location.href = $params.url
            } else if (location.pathname === "/login") {
              // TODO: $isActive("./login")
              $goto("/");
            } else {
              $goto(window.location.href);
            }
            waiting = false;
            delay = 5000
            error = {
              message: "Could not redirect to " + window.location.href,
            };
          }
        });
    }
  };
  let spin = true;

  // TODO: Place in util/animations
  const startSpinnin = () => {
    const interval = setInterval(() => {
      if (!waiting) {
        clearInterval(interval);
        spin = true;
      } else {
        spin = !spin;
      }
    }, 500);
  };

  $: if(waiting) startSpinnin();
  
  $: if(username) username = username.trim()

  // TODO: Fix splitting up into seperate pages
</script>

<form name="login">
  {#if error}<small
  in:fade={{ delay }}
  class="form-text text-muted">{error}</small
>{/if}
  {#if passwordReset}
    <PasswordReset {password} bind:username {success} />
  {:else}
    <LoginForm bind:username bind:password />
  {/if}
  <LandingPageButton
    {submit}
    disabled={waiting || !username || (!password && !passwordReset)}
  >
    {passwordReset ? "Opvragen" : "Inloggen"}
    <span class="icon"
      >{#if spin}<span transition:scale>{passwordReset ? "📨" : "🚀"}</span
        >{/if}</span
    >
  </LandingPageButton>  
  <small class="form-text text-right">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
      href=""
      on:click|preventDefault={() => (passwordReset = !passwordReset)}
      class="btn p-0 text-light btn-link"
    >
      <small
        >{passwordReset
          ? "Terug naar inloggen"
          : "Wachtwoord vergeten?"}</small
      >
    </a>
  </small>
</form>

<style>
  .icon {
    width: 1em;
    display: inline-block;
  }
</style>
