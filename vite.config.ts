import dotenv from "dotenv";

dotenv.config({path: '../.env'}); // load env vars from .env
import { svelte } from "@sveltejs/vite-plugin-svelte";
import routify from "@roxi/routify/vite-plugin";
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { version } from "./package.json";
// import tsconfig from "../../tsconfig.paths.json";
import tsconfig from "./tsconfig.json";
import { VitePWA } from "vite-plugin-pwa";
import * as manifest from "../static/manifest.json";
import fs from "fs"

const production = process.env.NODE_ENV === "production";
const assetsDir = "../static";
const projectRootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url))
);

const routesDir: any = {
  default: "src/routes/root",
 // onboarding: "src/routes/onboarding",
}

const aliases = Object.entries(tsconfig.compilerOptions.paths).map((alias) => ({
  find: alias[0].replace(/\/\*/, ""),
  replacement: path.resolve(
    projectRootDir,
    alias[1].slice().toString().replace(/\*/, "")
  ),
}));

aliases.push({
  find: ".routify",
  replacement: path.resolve(projectRootDir, ".routify/"),
});

if(production){
  fs.writeFile(assetsDir + '/version.html', APP_VERSION, (err) => {
    if (err) {
        if (err) throw err
        console.log('created version.html')
    }
  })
}

export default defineConfig({
  clearScreen: false,
  publicDir: assetsDir,
  optimizeDeps: {
    exclude: [], // do not pre-bundle some-library
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      external: [],
    },
  },

  plugins: [
    routify({
      routesDir,
      devHelper: false, //!production,
    }),
    svelte({
      emitCss: false,
      compilerOptions: {
        dev: !production,
      },
      extensions: [".md", ".svelte"],
    }),
    VitePWA({
      mode:
        process.env.NODE_ENV === "production" ? "production" : "development",
      base: "/",
      maximumFileSizeToCacheInBytes: 10000000, // 10 MB
      registerType: process.env.CLAIMS === "true" ? "autoUpdate" : undefined,
      includeAssets: ["favicon.svg"],
      manifest,
    }),
  ],

  server: {
    port: process.env.PORT || 3000,
    host: "127.0.0.1",
    proxy: {
      "/beheer": "http://localhost:3010",
    },
  },

  resolve: {
    alias: aliases,
  },

  define: {
    APP_VERSION: JSON.stringify(version),
    PUSHER_ID: JSON.stringify(process.env.PUSHER_KEY),
    BEAMS_ID: JSON.stringify(process.env.BEAMS_ID),
    SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    CHANGELOG_URL: JSON.stringify(process.env.CHANGELOG_URL),
    FEEDBACK_URL: JSON.stringify(process.env.FEEDBACK_URL),
    BUILD_DATE: JSON.stringify(new Date().toISOString()),
    RELOAD_SW: process.env.RELOAD_SW === "true" ? "true" : "false",
    __DEV__: process.env.NODE_ENV === "development",
    __LOCAL__: process.env.NODE_ENV === "local",
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
});
