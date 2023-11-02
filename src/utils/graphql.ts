import { ApolloClient, ApolloLink, createHttpLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { InMemoryCache, from } from "@apollo/client/core";
import { GRAPHQL_URI } from "@config/client";
import { setClient } from "svelte-apollo";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );

  if (!graphQLErrors && networkError) console.log(`[Network error]: ${networkError}`);
});

export function getGraphqlLink() {
  const authLink = setContext((_, { headers, ...context }) => {
    let token = "";
    try {
      token = JSON.parse(localStorage.getItem("user")).token;
    } catch (_) {}
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...context,
    };
  });

  const httpLink = createHttpLink({ uri: GRAPHQL_URI });

  const link = ApolloLink.from([authLink, httpLink]);
  return link;
}

export function updateGraphqlClient() {
  const link = getGraphqlLink();
  setClient(
    new ApolloClient({
      link: from([errorLink, link]),
      cache: new InMemoryCache(),
    })
  );
}

export function graphqlError(origin, error) {
  console.error(`Error occured in ${origin}:`, error.message);
}