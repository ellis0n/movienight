// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

import alpinejs from '@astrojs/alpinejs';


// https://astro.build/config
export default defineConfig(
  {
    experimental: {
      contentLayer: true
  },
  integrations: [tailwind(), db(), alpinejs()]
});