#!/usr/bin/env node
/**
 * Bundles the React component layer into dist/kinetika.js (ESM).
 *
 * React / react-dom stay external (peer dependencies) — the consumer or
 * Claude Design provides them. tokens.css is shipped separately; link it once.
 *
 * Usage: node scripts/build-bundle.mjs   (requires: npm i -D esbuild)
 */
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'dist'), { recursive: true });

await build({
  entryPoints: [join(root, 'src/index.js')],
  bundle: true,
  format: 'esm',
  outfile: join(root, 'dist/kinetika.js'),
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  logLevel: 'info',
});

console.log('dist/kinetika.js written.');
