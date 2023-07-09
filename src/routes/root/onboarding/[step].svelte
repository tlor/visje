<script lang="ts">
  import { params } from "@roxi/routify";
  import { currentSession, session } from "@root/_store";
  import { goto } from "@roxi/routify";
  import { scale, fade } from "svelte/transition";
  export let step;
  import Avatar from "@components-local/Onboarding/Avatar.svelte";
  import Study from "@components-local/Onboarding/Study.svelte";
  import MemberMeta from "@components-local/Onboarding/MemberMeta.svelte";
  import Groups from "@components-local/Onboarding/Groups.svelte";
  import LandingPageButton from "@components-local/_elements/LandingButton.svelte";
  import { userUpdateById } from "@models/User/user.gql";
  import { mutation } from "svelte-apollo";
  import { prepareModel } from "@utils/gql";
  import User from "@models/User/User";
  import Member from "@models/Member/Member";
  import { studyUpdateById } from "@models/Study/study.gql";
  import { memberMetaUpdateById } from "@models/MemberMeta/memberMeta.gql";
  import { onMount } from "svelte";

  let error;

  const user: User = $currentSession?.user;
  const member: Member = $currentSession?.member;
  const updateUserQuery = mutation(userUpdateById);
  const updateStudyQuery = mutation(studyUpdateById);
  const updateMemberMetaQuery = mutation(memberMetaUpdateById);

  function isFirstLogin() {
    return !!$currentSession.password;
  }

  function isIncomplete(object) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        if (!element) {
          return true;
        } else if (typeof element === "object") {
          isIncomplete(element);
        }
      }
    }
    return false;
  }

  async function submit() {
    if (step === "avatar") {
      const result = await updateUserQuery({
        variables: { id: user._id, record: prepareModel(user, ["avatar"]) },
      });
      if (result) {
        $session.setAvatar(user.avatar);
        $session.save();
        $goto("/onboarding/[step]", { step: "study" });
      } else {
        console.error("Something went wrong updating user");
      }
    } else if (step === "study") {
      if (member.meta.study.year) member.meta.study.year = member.meta.study.year.toString();
      const result = await updateStudyQuery({
        variables: { id: member.meta.study._id, record: prepareModel(member.meta.study) },
      });
      if (result) {
        $goto("/onboarding/[step]", { step: "check" });
      } else {
        console.error("Something went wrong updating study");
      }
    } else if (step === "check") {
      const result = await updateMemberMetaQuery({
        variables: { id: member.meta.memberMeta._id, record: prepareModel(member.meta.memberMeta) },
      });
      if (result) {
        $goto("/onboarding/[step]", { step: "groups" });
      } else {
        console.error("Something went wrong updating member meta");
      }
    } else if (step === "groups") {
      if (message) {
        waiting = true;
        const client = matrixcs.createClient({
          baseUrl: "https://matrix.ichthuszwolle.nl",
          accessToken: $currentSession.access_token,
          userId: `@${user.username}:ichthuszwolle.nl`,
        });
        client.startClient();

        let roomId;

        const content = {
          body: message,
          msgtype: "m.text",
        };

        client.once("sync", function (state, prevState, res) {
          console.log("state", state);
          if (state === "PREPARED") {
            const rooms = client.getRooms();
            let adminDMRoom = rooms.find((room) => {
              return room.name === "admin" && room?.realReceipts["m.read"] && room.realReceipts["m.read"]["@admin:ichthuszwolle.nl"];
            });
            if (!adminDMRoom)
              adminDMRoom = rooms.find((room) => {
                // Use outstanding invite room
                return room.name === "admin" || (room?.receipts["m.read"] && room.receipts["m.read"]["@admin:ichthuszwolle.nl"]);
              });
            console.log("matrix rooms:", rooms)
            roomId = adminDMRoom?.roomId;
            if (!roomId) {
              error = { message: "Profiel wordt afgerond, dit kan even duren.."}
              client.createRoom(
                {
                  preset: "trusted_private_chat",
                  invite: ["@admin:ichthuszwolle.nl"],
                  is_direct: true,
                },
                function (err, data) {
                  if (err) {
                    console.error("matrix err createRoom %s", JSON.stringify(err));
                    error = {message: "Er ging iets fout bij het versturen van je opmerking"}
                    client.stopClient();
                    waiting= false;
                    return;
                  }
                  roomId = data.room_id;
                  console.log("matrix room made!", roomId);
                  console.log("matrix sending: ", message);
                  client.sendEvent(roomId, "m.room.message", content, "", (err, res) => {
                    if (res.event_id) {
                      // End onboarding
                      delete user.password;
                      $session.update({
                        user: user,
                        member: member,
                        token: $currentSession.token,
                        groups: $currentSession.groups,
                      });
                      $session.save();
                      $goto("/");
                    } else {
                      console.log("matrix Something went wrong sending a message to admin", err, res);
                      error = {message: "Er ging iets fout bij het versturen van je opmerkingen"}
                      client.stopClient();
                      waiting= false;
                    }
                    waiting = false;
                    client.stopClient();
                  });
                }
              );
            } else {
              console.log("matrix existing roomId", roomId);
              console.log("matrix sending: ", message);
              client.sendEvent(roomId, "m.room.message", content, "", (err, res) => {
                if (res.event_id) {
                  // End onboarding
                  delete user.password;
                  $session.update({
                    user: user,
                    member: member,
                    token: $currentSession.token,
                    groups: $currentSession.groups,
                  });
                  $session.save();
                  $goto("/");
                } else {
                  console.log("matrix Something went wrong sending a message to admin", err, res);
                  error = {message: "Er ging iets fout bij het versturen van je opmerkingen."}
                      client.stopClient();
                      waiting= false;
                }
                waiting = false;
                client.stopClient();
              });
            }
          }
        });
      } else {
        // End onboarding
        delete user.password;
        $session.update({
          user: user,
          member: member,
          token: $currentSession.token,
          groups: $currentSession.groups,
        });
        $session.save();
        $goto("/");
      }
    }
  }

  const placeholderDataUrl =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAEAsMDgwKEA4NDhIREBMYKBoYFhYYMSMlHSg6Mz08OTM4N0BIXE5ARFdFNzhQbVFXX2JnaGc+TXF5cGR4XGVnY//bAEMBERISGBUYLxoaL2NCOEJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY//AABEIAQkBCQMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8An4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=";

  onMount(() => {
    // if (step === "avatar" && !isFirstLogin() && user.avatar && user.avatar !== placeholderDataUrl) $goto("/onboarding/[step]", { step: "study" })
    if (step === "study" && !isIncomplete(member.meta.study)) $goto("/onboarding/[step]", { step: "check" });
    if (step === "check" && !isIncomplete(member.meta.memberMeta)) $goto("/onboarding/[step]", { step: "groups" });
  });

  let message;
  let spin = true;
  let waiting = false;
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

  $: if (waiting) startSpinnin();
</script>


{#if member && user}
  {#if step === "avatar"}
    <Avatar avatar={$currentSession?.user.avatar} bind:image={user.avatar} />
  {:else if step === "study"}
    <Study bind:study={member.meta.study} />
  {:else if step === "check"}
    <MemberMeta bind:memberMeta={member.meta.memberMeta} />
  {:else if step === "groups"}
    <Groups {member} groups={$currentSession.groups} bind:message />
  {:else}step: {step} not found{/if}
{/if}
<div class="my-2">
{#if error}<small transition:fade class="form-text text-muted">{error?.message}</small>{/if}
</div>
<LandingPageButton {submit} disabled={waiting}
  >Ga verder <span class="icon">
    {#if spin}
      <span transition:scale>➡️</span>
    {/if}
  </span></LandingPageButton
>
