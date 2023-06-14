<script lang="ts">
  import {params} from '@roxi/routify'
  export let {step} = $params;
  import { currentSession, session } from "@root/_store";
  import { goto } from "@roxi/routify";
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

  const user: User = $currentSession?.user;
  const member: Member = $currentSession?.member;
  const updateUser = mutation(userUpdateById);
  const updateStudy = mutation(studyUpdateById);
  const updateMemberMeta = mutation(memberMetaUpdateById);

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
      const result = await updateUser({
        variables: { record: prepareModel(user, ["avatar"]) },
      });
      if (result) {
        $session.setAvatar(user.avatar);
        $session.save();
        $goto("/onboarding/study");
      } else {
        console.error("Something went wrong updating user");
      }
    } else if (step === "study") {
      if (member.meta.study.year)
        member.meta.study.year = member.meta.study.year.toString();
      const result = await updateStudy({
        variables: { record: prepareModel(member.meta.study) },
      });
      if (result) {
        $goto("/onboarding/check");
      } else {
        console.error("Something went wrong updating study");
      }
    } else if (step === "check") {
      const result = await updateMemberMeta({
        variables: { record: prepareModel(member.meta.memberMeta) },
      });
      if (result) {
        $goto("/onboarding/groups");
      } else {
        console.error("Something went wrong updating member meta");
      }
    } else if (step === "groups") {
      if (message) {
        const client = matrixcs.createClient({
          baseUrl: "https://matrix.ichthuszwolle.nl",
          accessToken: $currentSession.access_token,
          userId: user.username + ":ichthuszwolle.nl",
        });
        client.publicRooms(function (err, data) {
          if (err) {
            console.error("err %s", JSON.stringify(err));
            return;
          }
          console.log("data %s [...]", JSON.parse(JSON.stringify(data)));
        });
        let roomId;

        // TODO: find already open chat with admin
        // find invited direct message rooms
        const rooms = client.getRooms();
        const invitedDMRooms = rooms.filter((room) => {
          //getMyMembership -> "invite", "join", "leave", "ban"
          const membership = room.getMyMembership();
          const type = room.getDMInviter() ? "directMessage" : "room";
          console.log(room);
          return membership === "invite" && type === "directMessage";
        });

        client.createRoom(
          {
            preset: "trusted_private_chat",
            invite: ["@admin:ichthuszwolle.nl"],
            is_direct: true,
          },
          function (err, data) {
            if (err) {
              console.error("matrix err createRoom %s", JSON.stringify(err));
              return;
            }
            console.log("data %s [...]", JSON.parse(JSON.stringify(data)));
            roomId = data.room_id;
            console.log("matrix Congratulations! room made!");
            const content = {
              body: message,
              msgtype: "m.text",
            };
            console.log("matrix sending: ", message);
            client.sendEvent(
              roomId,
              "m.room.message",
              content,
              "",
              (err, res) => {
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
                  console.log(
                    "matrix Something went wrong sending a message to admin",
                    err,
                    res
                  );
                }
              }
            );
          }
        );
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
    // if (step === "avatar" && !isFirstLogin() && user.avatar && user.avatar !== placeholderDataUrl) $goto("/onboarding/study");
    if (step === "study" && !isIncomplete(member.meta.study))
      $goto("/onboarding/check");
    if (step === "check" && !isIncomplete(member.meta.memberMeta))
      $goto("/onboarding/groups");
  });

  let message;
</script>

{#if member && user}
  {#if step === "avatar"}
    <Avatar avatar={$currentSession?.user.avatar} bind:image={user.avatar} />
  {:else if step === "study"}
    <Study bind:study={member.meta.study} />
  {:else if step === "check"}
    <MemberMeta bind:memberMeta={member.meta.memberMeta} />
  {:else if step === "groups"}
    <Groups groups={$currentSession.groups} bind:message />
  {:else}step: {step} not found{/if}
{/if}
<LandingPageButton {submit}>Ga verder</LandingPageButton>
