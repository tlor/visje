import LogRocket from "logrocket";
import { get } from "svelte/store";

export class Session {
  entitlements: {
    clear: () => void;
    add: (arg0: any) => any;
    has: (arg0: any) => void;
  };
  expirationDate: Date;
  username: string;
  access_token: string;
  expirationTimer: NodeJS.Timeout;
  subscriptions: any;
  expired: boolean;
  currentSession: any;
  _user: any;
  _token: string;
  _member: any;
  _groups: [any];

  constructor(user: any) {
    this.currentSession = user;
    let expirationTimer: NodeJS.Timeout;

    Object.defineProperties(this, {
      subscriptions: {
        value: new Set(),
      },
      entitlements: {
        value: new Set(),
      },
      expirationDate: {
        value: new Date(),
      },
      expirationTimer: {
        get: () => expirationTimer,
        set: (v) => (expirationTimer = v),
      },
    });

    this.update(this.currentSession);
  }

  /**
   * Invalidate session data
   */
  clear(): void {
    this.entitlements.clear();
    this.expirationDate.setTime(0);
    this.username = undefined;
    this._user = undefined;
    this._token = undefined;
    this.access_token = undefined;
    clearTimeout(this.expirationTimer);
    this.expirationTimer = undefined;
    this.currentSession.set(undefined);
  }

  update(data: any): void {
    this.clear();
    if (data && data.subscribe) data = get(data);
    if (data !== undefined && data.user) {
      const { member, user, groups, token } = data;
      this._user = user;
      this._token = token;
      this._member = member;
      this._groups = groups || [];
      if (user.username && token) {
        this.username = user.username;

        const decoded: any = decode(token);
        if (decoded) {
          this.expirationDate.setTime(Date.now());
          this.expirationDate.setUTCSeconds(
            this.expirationDate.getSeconds() + 0
          ); // TODO: Use expiring JWT token instead of `+ 0`

          const expiresInMilliSeconds =
            this.expirationDate.valueOf() - Date.now();

          this.access_token = decoded.access_token;
          this.entitlements = new Set(decoded.entitlements);
          this.expired = false;
          if (expiresInMilliSeconds > 0) {
            this.expirationTimer = setTimeout(() => {
              console.log("Session should end now");
              this.expired = true;
              this.clear();
              this.fire();
            }, expiresInMilliSeconds);
          } else {
            this.expirationTimer = null;
          }
        }
      }
    }

    this.fire();
  }

  setAvatar(avatar) {
    this._user.avatar = avatar;
  }

  setAccessToken(access_token: string) {
    this.access_token = access_token;
    if (this._user.password === null) this._user.password = "";
  }

  /**
   * Persist into the backing store
   */
  save(): void {
    this.currentSession.set({
      access_token: this.access_token,
      token: this._token,
      user: this._user,
      member: this._member,
      groups: this._groups,
    });
    if (process.env.NODE_ENV !== "local") {
      LogRocket.init("zad0s2/visje");
      LogRocket.identify(this._user._id, {
        name: this._user.displayName,
        email: this._user.email,
        // @ts-ignore Add your own custom user variables here, ie:
        roles: this.entitlements,
        username: this.username,
      });
    }
  }

  /**
   * entitlements
   * @return {Array} decoded entitlements.
   */
  get getEntitlements(): any {
    return this.entitlements;
  }

  /**
   * http header suitable for fetch
   * @return {string} header.Authorization The Bearer access token.
   */
  get authorizationHeader(): any {
    return "Bearer " + this._token;
  }

  /**
   * As long as the expirationTimer is running and a token is present we must be valid
   * @return {boolean} true if session is valid (not expired)
   */
  get isValid(): boolean {
    return (
      (this.expirationDate.valueOf() - Date.now() > 0 ||
      this.expirationTimer === null
        ? true
        : false) && !!this._token
    );
    //return this.expirationTimer !== undefined;
  }

  /**
   * Remove all tokens from the session and the backing store
   */
  invalidate(): void {
    this.update(undefined);
  }

  /**
   * Check presence of an entilement.
   * @param {string} name of the entitlement
   * @return {boolean} true if the named entitlement is present
   */
  hasEntitlement(name: any): void {
    return this.entitlements.has(name);
  }

  fire(): void {
    this.subscriptions.forEach((subscription) => subscription(this));
  }

  /**
   * Fired when the session changes
   * @param {Function} subscription
   */
  subscribe(subscription): unknown {
    subscription(this);
    this.subscriptions.add(subscription);
    return () => this.subscriptions.delete(subscription);
  }
}

function decode(token: string): any | undefined {
  return token === undefined || token === "undefined"
    ? undefined
    : JSON.parse(atob(token.split(".")[1]));
}
