import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    svelte({
      preprocess: [vitePreprocess()],
    }),
  ],
  resolve: {
    alias: {
      $lib: resolve("./src/lib"),
    },
  },
  build: {
    outDir: "../dist",
  },
});
