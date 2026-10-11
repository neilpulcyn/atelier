// Headless walkthrough of Atelier at iPhone size. Usage: node scripts/walkthrough.mjs [baseUrl]
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = new URL('../screenshots/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  geolocation: { latitude: 51.5072, longitude: -0.1276 },
  permissions: ['geolocation'],
  locale: 'en-GB',
  timezoneId: 'Europe/London',
});
const page = await ctx.newPage();
const problems = [];
page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
page.on('response', (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()} ${r.url()}`); });

const shot = async (name) => {
  await page.waitForTimeout(500);
  // wait (max 8s) for images visible in the viewport; lazy off-screen images never load, so skip them
  await page.evaluate(() => Promise.race([
    new Promise((r) => setTimeout(r, 8000)),
    Promise.all([...document.images].filter((i) => { const b = i.getBoundingClientRect(); return !i.complete && b.bottom > 0 && b.top < innerHeight && b.width > 0; })
      .map((i) => new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); }))),
  ]));
  const broken = await page.evaluate(() => [...document.images].filter((i) => { const b = i.getBoundingClientRect(); return i.complete && i.naturalWidth === 0 && b.bottom > 0 && b.top < innerHeight; }).map((i) => i.src));
  if (broken.length) problems.push(`${name}: broken images ${broken.join(', ')}`);
  await page.screenshot({ path: OUT + name });
  console.log('saved', name);
};
const click = (text) => page.getByRole('button', { name: text, exact: true }).first().click();

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

await page.getByRole('button', { name: 'Discover my style' }).click();
await page.getByPlaceholder('e.g. Neil').fill('Neil');
await click('Menswear');
await click('Continue');
// Step 2 — image picks (screenshot 01)
for (const l of ['Tonal camel', 'Sharp tailoring', 'Thrifted 70s']) await page.getByRole('button', { name: l }).click();
await shot('01-quiz.png');
await click('Continue');
await page.getByRole('button', { name: /perfect knit/ }).click(); await click('Continue');
for (const w of ['Effortless', 'Polished', 'Understated']) await click(w);
await click('Continue');
await page.getByRole('button', { name: /Leather loafers/ }).click(); await click('Continue');
await page.getByRole('button', { name: /Neutrals/ }).click();
await page.getByRole('button', { name: /Navy & classics/ }).click(); await click('Continue');
await page.getByRole('button', { name: /Tailored & structured/ }).click(); await click('Continue');
for (const o of ['Office / work', 'Weekend casual', 'Shows & events']) await click(o);
await click('Continue');
await page.getByRole('button', { name: /Mid-range/ }).click(); await click('Continue');
for (const o of ['Layers I can take off', 'Must have pockets']) await click(o);
await click('Continue');
await page.getByRole('button', { name: /Somewhere in between/ }).click();
await click('Reveal my style');
await page.waitForSelector('text=Your style DNA');
await shot('02-style-result.png');
await page.getByRole('button', { name: 'Enter Atelier' }).click();
await page.waitForSelector('text=Recommended outfits');
await shot('03-feed.png');
// interact: like the first post via double tap + scroll check
await page.locator('article').first().scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'Like' }).first().click();
await page.locator('#feed-scroll').evaluate((el) => el.scrollTo(0, 0));

await page.getByRole('button', { name: 'Discover' }).click();
await page.waitForSelector('text=Picked for your style');
await shot('04-events.png');
// open an event, RSVP, back
await page.getByText('Upcoming').scrollIntoViewIfNeeded();
await page.locator('h3', { hasText: 'Brick Lane' }).click();
await page.getByRole('button', { name: /RSVP — Going/ }).click();
await page.getByRole('button', { name: '← Back' }).click();

await page.getByRole('button', { name: 'Stylist' }).click();
await page.waitForSelector('text=I’m Edie', { timeout: 20000 });
await page.getByLabel('Message').fill('What should I wear today?');
await page.getByRole('button', { name: 'Send' }).click();
await page.waitForSelector('text=Accessories', { timeout: 10000 });
await page.waitForTimeout(800);
// scroll chat so the outfit card is in view
await page.getByText(/outfit of the day/).last().evaluate((el) => el.scrollIntoView({ block: 'start' }));
await page.evaluate(() => { const sc = document.querySelectorAll('.scroll'); sc[sc.length - 1].scrollTop -= 12; });
await shot('05-stylist-chat.png');
const outfitText = await page.locator('ul').last().innerText();
const weatherPill = await page.getByRole('button', { name: 'Refresh weather' }).innerText();

await page.getByRole('button', { name: 'Profile' }).click();
await page.waitForSelector('text=Your style profile');
await shot('06-profile.png');

// extra: create a post via file upload
await page.getByRole('button', { name: 'Create', exact: true }).click();
await page.setInputFiles('[data-testid="file-input"]', new URL('../public/img/p54.jpg', import.meta.url).pathname);
await page.getByPlaceholder(/Write a caption/).fill('Testing my first Atelier look');
await page.getByRole('button', { name: 'Share look' }).click();
await page.waitForSelector('text=Testing my first Atelier look');
await shot('07-own-post.png');

const state = await page.evaluate(() => JSON.parse(localStorage.getItem('atelier:v1')));
console.log('\nWeather pill:', weatherPill);
console.log('Outfit:\n' + outfitText);
console.log('\nPersisted: profile=%s/%s likes=%d rsvp=%j posts=%d chat=%d', state.profile.primary, state.profile.secondary, state.likes.length, state.rsvp, state.myPosts.length, state.chat.length);
console.log('\nProblems:', problems.length ? problems : 'none');
await browser.close();
