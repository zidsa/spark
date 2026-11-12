// Bounded-exhaustive check of the example form: every value the schema rejects shows a message.
// Runs the real createExampleSchema and locales. Usage: bun .agents/skills/formal-starter/example-messages.ts
// Exit 0: property holds over the whole bounded domain. Exit 1: counterexample printed.
import { readFileSync } from 'node:fs';

import { i18nResources } from '~/libraries/i18next/locales';
import { localesSupported } from '~/libraries/i18next/resource';
import { createExampleSchema } from '~/modules/example/schemas/example.schema';

const formFile = new URL(
  '../../../src/modules/example/components/example-form.tsx',
  import.meta.url,
);
// getValidationMessage is private to example-form.tsx; its case labels are the keys it renders.
const handled = new Set(
  [...readFileSync(formFile, 'utf8').matchAll(/case '(validation:[a-z]+)':/g)].map(m => m[1]),
);

const lengths = (max: number) => Array.from({ length: max + 1 }, (_, n) => 'a'.repeat(n));
const emails = [
  '',
  ' ',
  'a',
  '@',
  'a@',
  '@b.co',
  'a@b',
  'a@b.',
  'a b@c.co',
  'a@b.co',
  'agent@example.com',
  'a@@b.co',
  'a@b..co',
  '.a@b.co',
  'a.@b.co',
  'a@-b.co',
  'a@b.c',
  'x'.repeat(65) + '@b.co',
  'ا@ب.co',
  'a@b.co ',
  ' a@b.co',
  'A@B.CO',
  'a+b@c.co',
  '"a"@b.co',
];
const fields = {
  title: lengths(102),
  description: lengths(502),
  email: emails,
};
const valid = { title: 'abc', description: 'a'.repeat(10), email: 'a@b.co' };

const say = (line: string) => process.stdout.write(`${line}\n`);

let checked = 0;
let failures = 0;
const fail = (msg: string) => {
  failures += 1;
  if (failures <= 10) say(`COUNTEREXAMPLE ${msg}`);
};

for (const [field, values] of Object.entries(fields)) {
  for (const value of values) {
    checked += 1;
    const result = createExampleSchema.safeParse({ ...valid, [field]: value });
    if (result.success) continue;
    for (const issue of result.error.issues) {
      const key = issue.message;
      if (!handled.has(key)) {
        fail(
          `${field}=${JSON.stringify(value).slice(0, 40)} -> "${key}" has no case in getValidationMessage`,
        );
        continue;
      }
      const [ns, name] = key.split(':');
      for (const locale of localesSupported) {
        const text = (i18nResources[locale]?.[ns] as Record<string, unknown> | undefined)?.[name];
        if (typeof text !== 'string' || text.length === 0) {
          fail(`${field}=${JSON.stringify(value).slice(0, 40)} -> "${key}" missing in ${locale}`);
        }
      }
    }
  }
}

if (failures > 0) {
  say(`FAIL EveryRejectionHasMessage: ${failures} counterexamples in ${checked} inputs`);
  process.exit(1);
}
say(
  `PASS EveryRejectionHasMessage holds (${checked} inputs, keys ${[...handled].join(', ')}, locales ${localesSupported.join(', ')})`,
);
