import { test, expect } from '@playwright/test';

test('Renders correct text without any itineraries existing', async ({ page }) => {
    await page.goto('https://voyager-phi.vercel.app/');

    await page.getByRole('button', { name: 'Trips' }).click();

    // expect(page.getByRole('button', { name: 'CURRENT'})).toBeFocused()

    expect(page.getByRole('tab', { name: 'CURRENT' })).toHaveAttribute('data-headlessui-state', 'selected')
})