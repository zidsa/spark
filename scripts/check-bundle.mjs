import { strict as assert } from 'node:assert';

import { Glob } from 'bun';

const chunks = [...new Glob('dist/client/assets/*.js').scanSync()];
assert(chunks.length > 0, 'Build the app before checking its client chunks.');

const oversized = chunks.filter(path => Bun.file(path).size > 500_000);
assert.equal(
  oversized.length,
  0,
  `Client chunks exceed 500 kB:\n${oversized
    .map(path => `${path}: ${(Bun.file(path).size / 1000).toFixed(2)} kB`)
    .join('\n')}`,
);

process.stdout.write(`Checked ${chunks.length} client chunks: all within 500 kB.\n`);
