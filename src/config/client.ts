export const GRAPHQL_URI = process.env.NODE_ENV === "production" ? "https://dev.ichthuszwolle.nl/graphql": `http://localhost:${SERVER_PORT}/graphql`;