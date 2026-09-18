/**
 * dsh-xiaomi-health build.
 *
 * Produces two bundles:
 *   - lib/index.js    host plugin (ESM, Node 22) — loaded by the cordis.patch.yml row
 *   - lib/client.js   client plugin (CJS, browser) — loaded by the Web harness module loader
 *
 * `@deepseek-ai/*` and `react` are externalized: the harness provides them at
 * runtime. Everything else is bundled.
 * Declaration files are emitted separately by `tsc -p tsconfig.build.json`.
 */
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'

mkdirSync('lib', { recursive: true })
const dshExternal = ['@deepseek-ai/cordis', '@deepseek-ai/dsh-*']

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  external: dshExternal,
  logLevel: 'info',
})

await build({
  entryPoints: ['src/client/index.tsx'],
  outfile: 'lib/client.js',
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: true,
  jsx: 'automatic',
  external: [
    ...dshExternal,
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'scheduler',
  ],
  banner: {
    js: "window.__ModuleLoader__.load({ id: 'dsh-xiaomi-health', factory: (require) => { var module = { exports: {} }; var exports = module.exports;",
  },
  footer: { js: 'return module.exports; } });' },
  logLevel: 'info',
})
