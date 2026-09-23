import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Render the repository-native SVG into the PNG resources required by Android.
const browser = await chromium.launch({
  channel: process.platform === 'win32' ? 'msedge' : undefined,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 1,
  });
  const svg = await readFile(new URL('../assets/brand.svg', import.meta.url), 'utf8');
  await page.setContent(`<body style="margin:0">${svg}</body>`);
  await page.screenshot({ path: 'assets/glamur-icon.png' });
  await page.setContent(`<body style="margin:0">${svg.replace(/<rect[^>]+\/>/, '')}</body>`);
  await page.screenshot({ path: 'assets/glamur-foreground.png', omitBackground: true });
} finally {
  await browser.close();
}
