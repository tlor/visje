// TODO: fix build Error: 'isAuthor' is not exported by ../libs/services/roles.js, imported by src/events/index.svelte on build
export function isAdmin(entitlements) {
  if (entitlements.has("admin")) return true;
  return false;
}

export function isAuthor(content, sessionStorage, session) {
  let author;
  if (content?.organiser) {
    if (content.organiser.organiser === "Group") {
      author = sessionStorage.groups.find(
        (g) => g._id === content.organiser?.group?._id
      );
    }
    if (content.organiser.organiser.match(/IFES|Landelijk/)) {
      author = sessionStorage.groups.find((g) => g.name === "Bestuur");
    }
  } else {
    author = (content.author === sessionStorage.user._id || content.author?._id === sessionStorage?.member?._id && !sessionStorage?.member?._id === null) || isAdmin(session.getEntitlements);
  }
  return !!author;
}

export function hasRole(
  roles: Array<string>,
  entitlements: Set<string>,
  checkIfUserHasRoles = false,
  masterRole: string = ""
) {
  if (checkIfUserHasRoles) return entitlements.size > 1;
  if (entitlements.has(masterRole + ".all") || isAdmin(entitlements)) {
    return true;
  } else {
    return roles.filter((role) => entitlements.has(role))?.length;
  }
}

// TODO: better way of coupling roles to pages, maybe use metadata https://routify.dev/docs/metadata
export function hasRolesForPage(currentPage, adminRoutes, entitlements) {
  if (isAdmin(entitlements)) return true;
  if (currentPage.match(/\/$/))
    currentPage = currentPage.replace(/\/$/, "/index");
  for (const route of adminRoutes) {
    if (route.pages.some((url) => url === currentPage)) {
      for (const role of entitlements) {
        if (role.match(route.role)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function hasRolesForModel(role, items, entitlements) {
  if (isAdmin(entitlements)) return true;
  for (const item of items) {
    if (item.role.some((r) => hasRole([r], entitlements, false, role))) {
      return true;
    }
  }
  return false;
}
