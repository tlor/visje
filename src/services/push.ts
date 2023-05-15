export const beamsClient = new Promise(async (resolve, _) => {
  window.navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    if (window.indexedDB) {
      import("@pusher/push-notifications-web").then(
        async (PusherPushNotifications) => {
          const _beamsClient = await new PusherPushNotifications.Client({
            // @ts-ignore gets replaced on build
            instanceId: BEAMS_ID,
            serviceWorkerRegistration: serviceWorkerRegistration,
          });
          resolve(_beamsClient);
        }
      );
    } else {
      resolve(null);
    }
  });
});
