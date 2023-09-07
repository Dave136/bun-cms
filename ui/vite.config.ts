import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    watch: {
      include: "src/**",
      exclude: "node_modules/**",
    },
  },
});
