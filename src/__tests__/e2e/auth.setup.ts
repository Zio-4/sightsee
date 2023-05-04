import { test as setup } from '@playwright/test';

const authFile = 'src/__tests__/e2e/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://voyager-phi.vercel.app/');
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Sign in with Discord' }).click();
  await page.getByLabel('Email or Phone Number*').click();
  await page.getByLabel('Email or Phone Number*').fill(process.env.DISCORD_EMAIL!);
  await page.getByLabel('Password*').click();
  await page.getByLabel('Password*').fill(process.env.DISCORD_PASSWORD!);
  await page.getByRole('button', { name: 'Log In' }).click();

  await page.waitForURL('https://voyager-phi.vercel.app/');
  await page.context().storageState({ path: authFile });
});