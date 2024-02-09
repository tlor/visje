export const HOST = window.location.hostname
export const GRAPHQL_URI = process.env.NODE_ENV === "production" ? "/graphql" : `http://${HOST}:${SERVER_PORT}/graphql`;
export const FILES_URI = process.env.NODE_ENV === "local" ? `http://${HOST}:${SERVER_PORT}/files` : "/files";