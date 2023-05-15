import { GRAPHQL_URI } from "@config/client";

export const statusPulse = {
  promise: fetch(GRAPHQL_URI, {
    method: "GET",
    headers: { Accept: "text/html" },
  }),
  refetch: (set) =>
    set({
      promise: fetch(GRAPHQL_URI, {
        method: "GET", // TODO: HEAD Request
        headers: { Accept: "text/html" },
      }),
    }),
};
