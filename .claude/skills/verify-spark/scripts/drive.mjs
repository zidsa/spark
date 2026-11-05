#!/usr/bin/env bun
// Drive one mapped Spark feature in headless Chromium and write proof to evidence/$RUN/<feature>/.
// Usage: RUN=<id> bun .claude/skills/verify-spark/scripts/drive.mjs <feature>
// Features: home-language | example-list | example-form | locale-routing | initial-html
import { execSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = process.env.RUN ?? 'default';
const feature = process.argv[2];
const url = readFileSync(join(skillDir, '.state', run, 'url'), 'utf8').trim();
const mode = readFileSync(join(skillDir, '.state', run, 'mode'), 'utf8').trim();
const out = join(skillDir, 'evidence', run, feature ?? 'unknown');
// A rerun under the same RUN replaces that feature's proof; use a new RUN to keep both.
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Playwright is not a Spark dependency; load the machine's global install.
const globalRoot = execSync('npm root -g').toString().trim();
const { chromium } = createRequire(`${globalRoot}/`)('playwright');

const log = (step, observed) => {
  const line = JSON.stringify({ at: new Date().toISOString(), step, observed });
  appendFileSync(join(out, 'steps.jsonl'), `${line}\n`);
  process.stdout.write(`${line}\n`);
};
const check = (cond, message) => {
  if (!cond) throw new Error(message);
};

const htmlAttrs = page =>
  page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir }));

// SPA and dev set <html lang/dir> after hydration, so wait for them instead of reading once.
const expectLocale = async (page, lang, dir) => {
  await page.waitForFunction(
    ([l, d]) => document.documentElement.lang === l && document.documentElement.dir === d,
    [lang, dir],
  );
  return htmlAttrs(page);
};

const proof = async (page, name) => {
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
  writeFileSync(join(out, `${name}.aria.txt`), await page.locator('body').ariaSnapshot());
};

const journeys = {
  'home-language': async page => {
    await page.goto(`${url}/en-sa/`);
    await page.getByRole('heading', { name: 'Welcome to Spark' }).waitFor();
    log('open /en-sa/', { url: page.url(), html: await expectLocale(page, 'en-sa', 'ltr') });
    await proof(page, '1-english-home');
    await page.getByRole('link', { name: 'العربية' }).click();
    await page.getByRole('heading', { name: 'مرحبًا بك في سبارك' }).waitFor();
    const ar = await expectLocale(page, 'ar-sa', 'rtl');
    check(new URL(page.url()).pathname.startsWith('/ar-sa'), `expected /ar-sa, got ${page.url()}`);
    log('click link "العربية"', { url: page.url(), html: ar });
    await proof(page, '2-arabic-home');
    await page.getByRole('link', { name: 'English' }).click();
    await page.getByRole('heading', { name: 'Welcome to Spark' }).waitFor();
    log('click link "English"', {
      url: page.url(),
      html: await expectLocale(page, 'en-sa', 'ltr'),
    });
  },
  'example-list': async page => {
    await page.goto(`${url}/en-sa/`);
    await page.getByRole('link', { name: 'Example' }).click();
    await page.getByRole('heading', { name: 'Example Page', level: 1 }).waitFor();
    const titles = ['First Example', 'Second Example', 'Third Example'];
    for (const name of titles) await page.getByRole('heading', { name }).waitFor();
    const statuses = await page
      .locator('.MuiCard-root')
      .evaluateAll(cards => cards.map(card => card.innerText.split('\n').slice(0, 2)));
    log('click link "Example"', { url: page.url(), cards: statuses });
    check(statuses.length === 3, `expected 3 cards, got ${statuses.length}`);
    await proof(page, '1-english-list');
    await page.goto(`${url}/ar-sa/example`);
    await page.getByRole('heading', { name: 'صفحة المثال', level: 1 }).waitFor();
    await page.getByText('مسودة').waitFor();
    log('open /ar-sa/example', { html: await expectLocale(page, 'ar-sa', 'rtl') });
    await proof(page, '2-arabic-list');
  },
  'example-form': async page => {
    await page.goto(`${url}/en-sa/example`);
    await page.getByRole('button', { name: 'Get Started' }).click();
    const errors = [
      'Must be at least 3 characters',
      'Must be at least 10 characters',
      'Invalid email address',
    ];
    for (const text of errors) await page.getByText(text).waitFor();
    log('submit empty form', { errors });
    await proof(page, '1-empty-submit');
    await page.getByRole('textbox', { name: 'Title' }).fill('Verify title');
    await page.getByRole('textbox', { name: 'Description' }).fill('A description long enough');
    await page.getByRole('textbox', { name: 'Email' }).fill('agent@example.com');
    await page.getByRole('button', { name: 'Get Started' }).click();
    for (const text of errors) await page.getByText(text).waitFor({ state: 'detached' });
    const values = await page
      .getByRole('textbox')
      .evaluateAll(inputs => inputs.map(input => input.value));
    log('fill valid values and submit', { errorsShown: 0, valuesAfterSubmit: values });
    await proof(page, '2-valid-submit');
  },
  'locale-routing': async page => {
    for (const [path, expected] of [
      ['/', '/ar-sa'],
      ['/xx-yy/example', '/ar-sa'],
      ['/en-sa/example', '/en-sa/example'],
    ]) {
      if (mode === 'ssg' && path === '/xx-yy/example') {
        // Only prerendered paths exist as files; the local static server has no fallback.
        log(`SKIPPED open ${path}`, {
          reason: 'ssg static host has no fallback for unknown paths',
        });
        continue;
      }
      await page.goto(`${url}${path}`);
      await page.waitForURL(u => u.pathname.replace(/\/$/, '') === expected);
      log(`open ${path}`, { url: page.url(), html: await htmlAttrs(page) });
    }
    await proof(page, '1-final');
  },
  'initial-html': async () => {
    // Raw HTML before any script runs: what crawlers and the first paint see.
    for (const [path, lang, dir, text] of [
      ['/en-sa/', 'en-sa', 'ltr', 'Welcome to Spark'],
      ['/ar-sa/example', 'ar-sa', 'rtl', 'First Example'],
    ]) {
      const html = await (await fetch(`${url}${path}`)).text();
      writeFileSync(join(out, `${path.replaceAll('/', '_')}.html`), html);
      const attrs = html.match(/<html[^>]*>/)?.[0] ?? '';
      const rendered = html.includes(text);
      log(`GET ${path} (mode=${mode})`, { htmlTag: attrs, contains: { [text]: rendered } });
      if (mode === 'ssr' || mode === 'ssg') {
        check(attrs.includes(`lang="${lang}"`) && attrs.includes(`dir="${dir}"`), attrs);
        check(rendered, `${path} initial HTML lacks "${text}"`);
      }
    }
  },
};

if (!journeys[feature]) {
  process.stderr.write(
    `unknown feature '${feature}'; one of ${Object.keys(journeys).join(', ')}\n`,
  );
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on('console', msg => msg.type() === 'error' && consoleErrors.push(msg.text()));
page.on('pageerror', err => consoleErrors.push(String(err)));
let status = 'pass';
let failure;
try {
  await journeys[feature](page);
} catch (err) {
  status = 'fail';
  failure = String(err?.message ?? err);
  await proof(page, 'failure').catch(() => undefined);
} finally {
  await browser.close();
}
if (status === 'pass' && consoleErrors.length > 0) {
  status = 'fail';
  failure = 'browser console errors during the journey';
}
const result = { feature, run, mode, url, status, failure, consoleErrors };
writeFileSync(join(out, 'result.json'), `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${status.toUpperCase()} ${feature} -> ${out}\n`);
process.exit(status === 'pass' ? 0 : 1);
