export class PusherService {
  _pusher: any = undefined;
  socketId: string;
  beamsClient: any = undefined;
  initiated: boolean = false;
  constructor() {
    if (window.indexedDB)
      // Skip during build
      import("./beams").then(async ({ beamsClient }) => {
        this.beamsClient = await beamsClient;
        this.beamsClient
          .start()
          .then((client) => client.getDeviceId())
          .then(() => this.beamsClient.addDeviceInterest("hello"))
          .then((deviceId) => console.log("Successfully registered with Beams. Device ID:", deviceId))
          .catch(console.error);
      });
  }

  async _waitforcreation() {
    while (!this._pusher)
      // define the condition as you like
      await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async getInstance(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this._pusher) resolve(this._pusher);
      if (this.initiated) {
        // In case of simultaneous initialization
        await this._waitforcreation();
        resolve(this._pusher);
      } else if (window.indexedDB && window.Pusher) {
        this.initiated = true;
        // Skip during build
        Pusher.logToConsole = false;

        this._pusher = new Pusher(PUSHER_ID, {
          cluster: "eu",
        });
        this._pusher.connection.bind("connected", () => {
          this.socketId = this._pusher.connection.socket_id;
          resolve(this._pusher);
          console.log("Successfully registered with Pusher. Session ID:", this._pusher.sessionID, "Socket ID:", this.socketId);
        })       
      }
    });
  }
}
