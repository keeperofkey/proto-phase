import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";
import glsl from 'vite-plugin-glsl'

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
  }),
  vite: {
    plugins: [glsl({include: '**/*.glsl', sourceMap: false})]
  }
});
