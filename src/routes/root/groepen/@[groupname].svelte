<script>
  import { groupOne, groupUpdateById } from "@models/Group/group.gql";
  import { roleUpdateById, roleCreateOne, roleRemoveById } from "@models/Role/role.gql";
  import MemberCard from "@components/Members/MemberCard.svelte";
  import { stripResult, prepareModel } from "@utils/gql";
  import { isGroupAdmin, isAdmin} from "@services/roles";
  import { query, mutation } from "svelte-apollo";
  import { currentSession, session, features, notification } from "@root/_store";
  import SelectMember from "@root/components/Members/SelectMember.svelte";
  import SelectRole from "@root/components/Roles/SelectRole.svelte";
  import Modal from "@components/Elements/Modal.svelte";

  export let groupname;
  export let filter = {
    name: groupname,
  };

  let group;
  let roleEdit;
  let groupEdit;

  const groupQuery = query(groupOne, { variables: { filter } });
  const updateGroupQuery = mutation(groupUpdateById);
  const updateRoleQuery = mutation(roleUpdateById);
  const deleteRoleQuery = mutation(roleRemoveById);
  const createRoleQuery = mutation(roleCreateOne);

  function getGroupSpecialRoleMembers(group) {
    const roles = getGroupSpecialRoles(group)
    return roles.map(r => r.member)
  }

  function getGroupSpecialRoles(group) {
    const groupMemberIds = group.members.map(m=> m._id)
    return group.roles.filter((role) => !groupMemberIds.includes(role.member._id))
  }

  $: if ($groupQuery.data) {
    if(!group) group = stripResult($groupQuery.data);
  } else if ($groupQuery.error) {
    console.log($groupQuery.error.message); // TODO: Add logging
  }

  $: if (groupname && group) {
    groupQuery.refetch({ variables: { filter } });
  }

  async function editRole(roleId, roleName) {
    if (!roleName && roleId) {
      await deleteRoleQuery({ variables: { id: roleId } })
        .then(async (r) => {
          group.roles = group.roles.filter((role) => role._id !== roleId);
          await updateGroupQuery({
            variables: { id: group._id, record: prepareModel(group, ["roles"]) },
          })
            .then((r) => {
              notification.set({ type: "success", content: `${group.name} succesvol aangepast` });
              location.reload(); // Fixes bug, where if you would refetch groupQuery roles would be [ null ] instead of actual [] some cache bug in apollo
            })
            .catch((err) => notification.set({ type: "danger", content: `Error bij aanpassen groep, ${err.message}` }));
          roleEdit = null;
        })
        .catch((err) => notification.set({ type: "danger", content: `Error bij aanpassen rol, ${err.message}` }));
    } else if (!roleName) {
      roleEdit = null;
    }
    if (roleId && roleName) {
      await updateRoleQuery({
        variables: { id: roleId, record: { role: roleName } },
      })
        .then((r) => {
          notification.set({ type: "success", content: `${group.name} succesvol aangepast` });
          roleEdit = null;
          groupQuery.refetch({ variables: { filter } });
        })
        .catch((err) => notification.set({ type: "danger", content: `Error bij aanpassen groep, ${err.message}` }));
    } else if (roleName) {
      const role = {
        role: roleName,
        member: roleEdit,
      };
      const result = await createRoleQuery({
        variables: { record: prepareModel(role) },
      })
        .then(async (res) => {
          role._id = stripResult(res.data).recordId;
          group.roles.push(role);
          //notification.set({ type: "success", content: `Nieuwe rol '${roleName}' aangemaakt` });
          await updateGroupQuery({
            variables: { id: group._id, record: prepareModel(group, ["roles"]) },
          })
            .then((r) => {
              roleEdit = null;
              groupQuery.refetch({ variables: { filter } });
              notification.set({ type: "success", content: `${group.name} succesvol aangepast` });
            })
            .catch((err) => notification.set({ type: "danger", content: `Error bij aanpassen groep, ${err.message}` }));
        })
        .catch((err) => notification.set({ type: "danger", content: `Error bij aanmaken nieuwe rol '${roleName}', ${err.message}` }));
    }
  }

  let showModal;
  let selectedMemberIds = [];

  function closeModal() {
    showModal = !showModal;
  }

  async function updateGroup(fields) {
    await updateGroupQuery({
            variables: { id: group._id, record: prepareModel({...group, members: selectedMemberIds}, fields) },
          })
            .then((r) => {
              notification.set({ type: "success", content: `${group.name} succesvol aangepast` });
              groupQuery.refetch({ variables: { filter } });
            })
            .catch((err) => notification.set({ type: "danger", content: `Error bij aanpassen groep, ${err.message}` }));
    closeModal();
  }
</script>

<Modal bind:show={showModal} on:cancel={closeModal} on:submit={()=> updateGroup(["members"])}>
    <div>
      <SelectMember bind:selectedIds={selectedMemberIds} selectedMembers={group.members} />
    </div>
</Modal>

<section class="py-5 bg-gradient-{group?.color || 'info'} position-relative overflow-hidden">
  <!-- <div class="position-absolute w-100 z-inde-1 top-0 mt-n3">
    <svg width="100%" viewBox="0 -2 1920 157" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>wave-down</title>
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g fill="#FFFFFF" fill-rule="nonzero">
                <g id="wave-down">
                    <path d="M0,60.8320331 C299.333333,115.127115 618.333333,111.165365 959,47.8320321 C1299.66667,-15.5013009 1620.66667,-15.2062179 1920,47.8320331 L1920,156.389409 L0,156.389409 L0,60.8320331 Z" id="Path-Copy-2" transform="translate(960.000000, 78.416017) rotate(180.000000) translate(-960.000000, -78.416017) "></path>
                </g>
            </g>
        </g>
    </svg>
  </div> -->
  <img src="../../assets/img/shapes/waves-white.svg" class="position-absolute opacity-6 h-100 top-0 d-md-block d-none" alt="" />
  <div class="container pt-6 pb-5 position-relative">
    <div class="row">
      <div class="col-md-6 mx-auto text-center">
        <span class="badge badge-white text-dark mb-2">{group?.type || "groep"}</span>
        {#if groupEdit}
          <h2 class="text-white mb-3 empty:before:tw-content-[attr(placeholder)] before:tw-text-gray-500" placeholder="Titel" bind:textContent={group.name} contenteditable="true" />
          <h5 class="text-white font-weight-light empty:before:tw-content-[attr(placeholder)] before:tw-text-gray-500" placeholder="Omschrijf je {group?.type} in het kort.." bind:innerHTML={group.description} contenteditable="true" />
          {#if isAdmin(session.getEntitlements)}
          <a class="text-white tw-mr-2"  href="javascript:;" on:click={() => {showModal = !showModal}}>
            <i class="fas fa-user"></i> Leden bewerken
          </a>
          {/if}          
        {:else}
          <h2 class="text-white mb-3">{group?.name || groupname}</h2>
          <h5 class="text-white font-weight-light">
            {@html group?.description || ""}
          </h5>
        {/if}
        {#if (isGroupAdmin(session.getEntitlements) || isAdmin(session.getEntitlements))}
            <a class="text-white" href="javascript:;" on:click={() => {
              if(groupEdit) updateGroup(["description", "name"]);
              groupEdit = !groupEdit
            }}><i class="fa" class:fa-pen={!groupEdit} class:fa-save={groupEdit} /> {groupEdit ? "Opslaan" : "Bewerken"}</a>
        {/if}
      </div>
    </div>
    <div class="row mt-8">
      {#if group?.members}
      {#each getGroupSpecialRoleMembers(group) as member}
      {@const memberMeta = group.roles.find((r) => r?.member?._id === member._id)}
      <div class="col-md-4 mb-md-0 tw-mb-7">
        <MemberCard {member} link={true}>
          {#if roleEdit && roleEdit === member._id}
            <SelectRole selectedRole={memberMeta?.role} on:change={(e) => editRole(memberMeta?._id, e.detail)} />
          {:else}
            <p class="mt-2">
              {memberMeta?.role || "Lid"}
              {#if (isAdmin(session.getEntitlements))}
                <a class="" href="javascript:;" on:click={() => (roleEdit = member._id)}><i class="fa fa-pen" /></a>
              {/if}
            </p>
          {/if}
        </MemberCard>
      </div>
      {/each}
        {#each group.members as member}
          {@const memberMeta = group.roles.find((r) => r?.member?._id === member._id)}
          <div class="col-md-4 mb-md-0 tw-mb-7">
            <MemberCard {member} link={true}>
              {#if roleEdit && roleEdit === member._id}
                <SelectRole selectedRole={memberMeta?.role} on:change={(e) => editRole(memberMeta?._id, e.detail)} />
              {:else}
                <p class="mt-2">
                  {memberMeta?.role || "Lid"}
                  {#if (($features?.groups?.groupEdit && isGroupAdmin(group, $currentSession) || isAdmin(session.getEntitlements)))}
                    <a class="" href="javascript:;" on:click={() => (roleEdit = member._id)}><i class="fa fa-pen" /></a>
                  {/if}
                </p>
              {/if}
            </MemberCard>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <div class="position-absolute w-100 bottom-0">
    <svg width="100%" viewBox="0 -1 1920 166" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>wave-up</title>
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(0.000000, 5.000000)" fill="#FFFFFF" fill-rule="nonzero">
          <g id="wave-up" transform="translate(0.000000, -5.000000)">
            <path d="M0,70 C298.666667,105.333333 618.666667,95 960,39 C1301.33333,-17 1621.33333,-11.3333333 1920,56 L1920,165 L0,165 L0,70 Z" />
          </g>
        </g>
      </g>
    </svg>
  </div>
</section>
