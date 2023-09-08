import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [vitePreprocess()],
    }),
  ],
  base: "./",
  resolve: {
    alias: {
      $lib: resolve("./src/lib"),
    },
  },
  build: {
    watch: {
      include: "src/**",
      exclude: "node_modules/**",
    },
  },
});
