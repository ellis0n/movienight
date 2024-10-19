// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import db from '@astrojs/db';
import vercel from '@astrojs/vercel/serverless';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentLayer: true,
  },
  integrations: [tailwind(), db(), clerk()],
  output: 'server',
  adapter: vercel(),
});