import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Anciennes adresses des guides CLI : pages de redirection, hors sitemap.
const movedGuides = ["anatomy-of-a-job", "launch-a-job-from-the-cli-and-the-api", "manage-jobs-and-parameters-from-the-cli", "read-csv-json-and-parquet-files", "read-and-write-sqlite-databases", "configure-snowflake-bigquery-and-cdc-sources", "clean-split-window-pivot-and-script", "call-a-project-from-a-project", "pass-parameters-to-a-sub-project", "declare-project-triggers", "run-triggers-with-hdrctl-watch", "run-hydra-in-production-with-hdrctl-serve", "connect-claude-code-to-hydra-etl-with-mcp"];

export default defineConfig({
  integrations: [
    react(),
    sitemap({ filter: (page) => !movedGuides.some((s) => page.includes('/studio/' + s)) }),
  ],

  site: 'https://hydraetl.com',
  output: 'static',
  outDir: './dist',
  publicDir: './public',
  base: '/',

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) return 'vendor';
            if (id.includes('HydraCore')) return 'hydra-core';
          }
        }
      }
    }
  }
});
