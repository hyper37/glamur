import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: { channel: process.platform === 'win32' ? 'msedge' : undefined },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1050 } },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } },
  ],
  reporter: 'list',
  webServer: {
    command: 'npm run build:web && node scripts/serve-demo.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
