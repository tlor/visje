import { stripResult, deleteTypeNames } from "@utils/gql";
import { query, subscribe } from "svelte-apollo";
import { features } from "@endpoints/features.gql";

export async function getFeatures() {
  const featuresQuery = query(features, {
    fetchPolicy: "network-only",
  });
  const result = await featuresQuery.result();
  const data = stripResult(result.data);
  const featurelist = deleteTypeNames(data.features);

  return featurelist;
}
