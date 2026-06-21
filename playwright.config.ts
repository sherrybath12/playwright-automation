import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 2 : parseInt(process.env.WORKERS || '4'),
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      testMatch: /tests\/ui\/.+\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL,
      },
    },
    {
      name: 'firefox',
      testMatch: /tests\/ui\/.+\.spec\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.BASE_URL,
      },
    },
    {
      name: 'api',
      testMatch: /tests\/api\/.+\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL,
      },
    },
  ],
});
