import { test, expect, type Page } from '@playwright/test';


test('Can go to every page without breaking', async ({ page }) => {
    await page.goto('https://sightsee.vercel.app/');
    expect(page.getByText('Welcome to a stress-free vacation')).toBeDefined()

    await page.getByRole('button', { name: 'Trips' }).click();
    expect(page.getByText('Your Trips')).toBeDefined()

    await page.getByRole('button', { name: 'Plan trip' }).click();
    expect(page.getByText('Create trip')).toBeDefined()

    await page.getByRole('button', { name: 'Discover' }).click();
    expect(page.getByPlaceholder('Find your dream getaway!')).toBeDefined()
})