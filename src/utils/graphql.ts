import { ApolloClient, ApolloLink, createHttpLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { InMemoryCache } from "@apollo/client/core";
import { GRAPHQL_URI} from "@config/client"
import { setClient } from "svelte-apollo";

export function getGraphqlLink(){
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
          link,
          cache: new InMemoryCache(),
          onError: ({ networkError, graphQLErrors }) => {
            console.log("graphQLErrors", graphQLErrors);
            console.log("networkError", networkError);
          },
        })
      );
}