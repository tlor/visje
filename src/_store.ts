import { writable, readable, get } from "svelte/store";
import { Session } from "@utils/Session";
import { statusPulse } from "@services/status";
import { getFeatures } from "@services/features";
import { PusherService } from "@services/pusher";

export const loggedIn = () =>
  JSON.parse(localStorage.getItem("user"))?.token || undefined;
export const currentSession = writable(loggedIn());
export const env = readable(process.env.NODE_ENV);

let _features;

function createFeatures() {
	const { subscribe, set } = writable(null);

  return {
		subscribe,
    load: async () => {
      _features = await getFeatures()
      set(_features)
    },
		get: () => _features
	};
}

export const features = createFeatures();

features.subscribe((features) => console.log("features", features));

export const status = readable(statusPulse, function start(set) {
  const interval = setInterval(() => {
    statusPulse.refetch(set);
  }, 6000);

  return function stop() {
    clearInterval(interval);
  };
});
export const session = new Session(currentSession);
export const notification: any = writable();
export const notifications: any = writable([]);
export const pushService = new PusherService();
export const pusher = pushService.getInstance();
export const membersLoaded: any = writable(false);

notification.subscribe((notification) =>{
  if(notification){
    notification.remove = (index) => {
      const list = get(notifications)
      if (index > -1){
        while(index > (list.length - 1)) index = index -1 // In case simultaneously hidden
        list.splice(index, 1);
        notifications.set(list)
      }
    } 
    notifications.set([...get(notifications), notification])
  }
})

currentSession.subscribe((val) => {
  if (val != undefined) {
    // If user is set, update localStorage
    localStorage.setItem("user", JSON.stringify(val));
  } else if (
    !localStorage.getItem("user") ||
    session.isValid ||
    session.expired ||
    (!session.isValid &&
      session.expired === false &&
      localStorage.getItem("user"))
  ) {
    // If user is undefined but session is still valid or if session expired, invalidate user
    localStorage.removeItem("user");
  } else if (
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user")) &&
    JSON.parse(localStorage.getItem("user")).token &&
    JSON.parse(localStorage.getItem("user")).access_token
  ) {
    // If user and session are undefined but user is available in localStorage, update session with user
    const sessionData = JSON.parse(localStorage.getItem("user"));
    session.update(sessionData);
    session.save();
    console.log(
      `Session restored
          ${sessionData.user.username}
          and have the following roles:
          ${[...session.getEntitlements]}`
    );
  } else if (
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user")) &&
    JSON.parse(localStorage.getItem("user")).token &&
    !JSON.parse(localStorage.getItem("user")).token.access_token
  ) {
    // Remember user for onboarding without acces token
    const sessionData = JSON.parse(localStorage.getItem("user"));
    session.update(sessionData);
    session.save();
    console.log(
      `Session restored without acces token (Onboarding)
          ${sessionData.user.username || sessionData.user.displayName}
          and have the following roles:
          ${[...session.getEntitlements]}`
    );
  } else if (
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user")) &&
    !JSON.parse(localStorage.getItem("user")).token
  ) {
    // If user is available in localStorage but no token is present, invalidate user
    localStorage.removeItem("user");
  }
});
