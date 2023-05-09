import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true
  },
  integrations: [svelte(), sitemap()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});