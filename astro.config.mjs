import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sct-engineeringworks.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
});

