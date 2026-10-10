/* E2E contra um web já no ar (BASE_URL, padrão http://localhost:4321).
   Sem webServer de propósito: o web e a API sobem à parte (README,
   "Rodar em dev"). Os fluxos com conta GRAVAM no banco da API que o
   web usa; rode contra o banco local de dev, nunca contra produção. */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
