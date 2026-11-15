import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { jsonLd, llmsTxt, staticHtml } from './src/site/seo';

/**
 * Builds what crawlers read from the site's own copy: the page as plain HTML inside #root (replaced by the
 * interactive page as soon as it runs), the structured data, and llms.txt. The demo page is left as it is.
 */
function readableSite(): Plugin {
  return {
    name: 'stratasight-readable-site',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.filename.replace(/\\/g, '/').includes('/demo/')) return html;
        return html
          .replace('<div id="root"></div>', `<div id="root"><div class="readable">${staticHtml()}</div></div>`)
          .replace('</head>', `    <script type="application/ld+json">${jsonLd()}</script>\n  </head>`);
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() });
    },
  };
}

// Two real HTML entry points: the public site (/) and the platform demo (/demo/).
// A relative base keeps every asset path working on the custom domain, on a
// username.github.io/<repo>/ project URL, and when the dist folder is opened from any static host.
export default defineConfig({
  base: './',
  plugins: [react(), readableSite()],
  build: {
    rollupOptions: {
      input: {
        site: fileURLToPath(new URL('./index.html', import.meta.url)),
        demo: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
