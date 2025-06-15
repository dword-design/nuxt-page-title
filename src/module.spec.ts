import { expect, test } from '@playwright/test';
import endent from 'endent';
import { execaCommand } from 'execa';
import getPort from 'get-port';
import nuxtDevReady from 'nuxt-dev-ready';
import outputFiles from 'output-files';
import kill from 'tree-kill-promise';

test('name', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.ts':
      "export default { modules: [['../../src', { name: 'Test-App' }]] }",
    'pages/index.vue': endent`
      <template>
        <div />
      </template>
    `,
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
    stderr: 'inherit',
  });

  try {
    await nuxtDevReady(port);
    await page.goto(`http://localhost:${port}`);
    await expect(page).toHaveTitle('Test-App');
  } finally {
    await kill(nuxt.pid);
  }
});

test('name and description', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.ts':
      "export default { modules: [['../../src', { name: 'Test-App', description: 'This is the ultimate app!' }]] }",
    'pages/index.vue': endent`
      <template>
        <div />
      </template>
    `,
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
    stderr: 'inherit',
  });

  try {
    await nuxtDevReady(port);
    await page.goto(`http://localhost:${port}`);
    await expect(page).toHaveTitle('Test-App: This is the ultimate app!');
  } finally {
    await kill(nuxt.pid);
  }
});

test('other page', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.ts':
      "export default { modules: [['../../src', { name: 'Test-App' }]] }",
    'pages/foo.vue': endent`
      <template>
        <div />
      </template>

      <script setup>
      useHead({ title: 'Other page' });
      </script>
    `,
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
    stderr: 'inherit',
  });

  try {
    await nuxtDevReady(port);
    await page.goto(`http://localhost:${port}/foo`);
    await expect(page).toHaveTitle('Other page | Test-App');
  } finally {
    await kill(nuxt.pid);
  }
});
