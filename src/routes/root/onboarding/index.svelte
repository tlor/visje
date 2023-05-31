<script>
  import User from "@components-local/Onboarding/User.svelte";
  import LandingPageButton from "@components-local/_elements/LandingButton.svelte";
  import { register, available } from "@endpoints/register.gql";
  import { goto } from "@roxi/routify";
  import { currentSession } from "@root/_store";
  import { session } from "@root/_store";
  let username = "";
  let password = "";
  let error;
  let usernameAlreadyRegistered = false;
  let showPasswordField, disableUserField;
  import { mutation, query } from "svelte-apollo";

  const registerMutation = mutation(register);
  const availableMutation = mutation(available);

  async function submit() {
    // TODO: implement username check
    if (!showPasswordField) {
      const result = await availableMutation({
        variables: { input: { user: username.toLowerCase() } },
      }).catch((err) => {
        error = err.graphQLErrors[0];
        if (error.extensions?.exception?.errcode === "M_USER_IN_USE") {
          alert(error.extensions.exception.data.error); // TODO: visual representation not available
        } else if (error.extensions?.exception?.errcode === "M_INVALID_USERNAME") {
          alert(error.extensions.exception.data.error); // TODO: visual representation not valid
        } else {
          // TODO: catch error
        }
      });
      if (result?.data?.available) showPasswordField = true;
    } else if (usernameAlreadyRegistered) {
      alert("Nog niet geimplementeerd, voor nu kan je je huidige wachtwoord blijven gebruiken");
      $goto("/")
    } else {
      await registerMutation({
        variables: {
          input: {
            user: username.toLowerCase(),
            password,
            id: $currentSession.user.id || $currentSession.user._id,
          },
        },
      })
        .catch((err) => {
          error = err.graphQLErrors[0];
        })
        .then((result) => {
          if (result?.data?.register) {
            $session.update(result.data.register);
            $session.save();
            $goto("/onboarding/avatar");
          } else {
            console.log("no acces token received", result);
            if (!error.message)
              error = result?.errors[0] || {
                message: "Er is iets fout gegaan",
              };
          }
        });
    }
  }

  $: if (error) console.log(error);

  $: if ($currentSession?.user.username) {
    if ($currentSession?.user.password !== null) {
      console.log($currentSession?.user.password)
      $goto("/onboarding/avatar");
    }
    disableUserField = true;
    username = $currentSession?.user.username;
    usernameAlreadyRegistered = true;
    showPasswordField = true;
  }
</script>

<!-- TODO: add logout button -->

<User bind:error bind:username bind:password bind:showPasswordField bind:disableUserField />

<LandingPageButton {submit}>Volgende</LandingPageButton>
