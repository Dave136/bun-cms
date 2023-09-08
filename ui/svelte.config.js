import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    vitePreprocess({
      style: {
        css: {
          postcss: join(__dirname, "postcss.config.cjs"),
        },
      },
    }),
  ],
};
