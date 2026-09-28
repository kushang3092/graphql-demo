import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Falls back to localhost for local dev. In production, Vercel injects
// VITE_GRAPHQL_URL at build time (set as a project env var / GitHub secret).
const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql";

const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
  }),
  cache: new InMemoryCache(),
});

export default client;
