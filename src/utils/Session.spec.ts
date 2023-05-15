import { get, writable } from "svelte/store";
import { Session } from "./Session";
let localStorage;
const user = writable(undefined);
const session = new Session(user);

describe("Session", () => {
    it("isInvalid with undefined user", () => {
        expect(session.isValid).to.eq(false);
        expect(session.username).to.eq(undefined);
        expect(session.access_token).to.eq(undefined);
        expect(session._user).to.eq(undefined);
        expect(session.authorizationHeader).to.deep.eq({ Authorization: "Bearer undefined" });
    });
    localStorage = JSON.stringify({
        access_token: "token",
        user: {
            username: "username",
            email: "email@domain.com",
            role: "test,admin",
            avatar: "",
            group: "",
            _id: "id",
        },
    });
    // Update user to object from localStorage
    user.set(JSON.parse(localStorage));

    it("isValid with restore from local storage", () => {
        session.update(get(user));

        expect(session.username).to.eq("username");
        expect(session.access_token).to.eq("token");

        session.save();
        expect(session.isValid).to.eq(true);
        expect(get(session.currentUser).user.username).to.eq("username");
        expect(get(session.currentUser).user._id).to.eq("id");
        expect(session.access_token).to.eq("token");

        const unsubscribe = user.subscribe((val) => {
            expect(val.user.username).to.eq("username");
            expect(val.user._id).to.eq("id");
        });
        unsubscribe();

        expect(session.authorizationHeader).to.deep.eq({ Authorization: "Bearer token" });
    });

    it("correclty parsed Entitlements", () => {
        expect(session.hasEntitlement("test"));
        expect(session.hasEntitlement("admin"));
    });

    it("isInvalid on logout", () => {
        session.invalidate();
        expect(session.isValid).to.eq(false);
        expect(session.username).to.eq(undefined);
        expect(session.access_token).to.eq(undefined);
        expect(get(session.currentUser)).to.deep.eq(undefined);
        expect(session.authorizationHeader).to.deep.eq({ Authorization: "Bearer undefined" });
    });
});
