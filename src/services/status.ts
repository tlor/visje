import { GRAPHQL_URI } from "@config/client";

export const statusPulse = {
  status: "polling",
  refetch: () => {
    fetch(GRAPHQL_URI, {
      method: "GET", // TODO: HEAD Request
      headers: { Accept: "text/html" },
    }).then((res) => {
      console.log("status p", res);
      // Update the latest status when the request is successful
      statusPulse.status = "online";
    }).catch((res) => {
      console.log("status c", res);
      // Update the latest status when the request fails
      statusPulse.status = "offline";
    });
  },
};

