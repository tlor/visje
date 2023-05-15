<script>
  import { goto, params } from "@roxi/routify";
  import { fade, scale } from "svelte/transition";
  import { login } from "@endpoints/login.gql";
  import { mutation, query } from "svelte-apollo";
  import { session } from "@root/_store";
  import LoginForm from "@components-local/Login/LoginForm.svelte";
  import PasswordReset from "@components-local/Login/PasswordReset.svelte";
  import LandingPageButton from "@components-local/_elements/LandingButton.svelte";

  let username, password, error, succes;
  let waiting = false;
  let passwordReset = $params.reset ? true : false;

  const loginQuery = query(login);

  const submit = async () => {
    waiting = true;
    startSpinnin();
    if (passwordReset) {
      await query("resetPassword", {
        variables: { input: { user: username } },
      })
        .catch((err) => {
          waiting = false;
          error = err;
        })
        .then((result) => {
          if (result) {
            waiting = false;
            succes = true;
          }
        });
    } else {
      await loginQuery
        .refetch({ input: { user: username, password } })
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
            $session.update(result.data.login);
            $session.save();
            console.log(location.pathname);
            if (location.pathname === "/") {
              window.location.reload();
            } else if (location.pathname === "/login") {
              // TODO: $isActive("./login")
              $goto("/");
            } else {
              $goto(window.location.href);
            }
            waiting = false;
            error = {
              message: "Could not redirect to " + window.location.href,
            };
          }
        });
    }
  };
  let spin = true;
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
</script>

<form name="login">
  {#if passwordReset}
    <PasswordReset {password} />
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
  {:else}
    <LoginForm bind:username bind:password {error} {succes} />
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
</form>

<style>
  .icon {
    width: 1em;
    display: inline-block;
  }
</style>
