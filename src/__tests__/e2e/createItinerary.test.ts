import { test, expect, type Page } from '@playwright/test';
import format from 'date-fns/format';

function makeString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

// {format(new Date(itin.endDate), 'MMM d, yyyy')}

test('Can create an itinerary when signed in', async ({ page }) => {
    const itineraryName = makeString(5)

    await page.goto('https://sightsee.vercel.app/trips/plan');

    // await page.locator('input[name="itineraryName"]').click();
    await page.locator('input[name="itineraryName"]').fill(itineraryName);
    // await page.locator('input[name="destinations"]').click();
    await page.locator('input[name="destinations"]').fill('Washington D.C.');

    const date = new Date()
    date.setDate(date.getDate() + 1)

    await page.getByRole('button', { name: `${format(date, 'MMM d, yyyy')}` }).click();
    date.setDate(date.getDate() + 4)
    await page.getByRole('button', { name: `${format(date, 'MMM d, yyyy')}` }).click();
    await page.getByRole('button', { name: 'Create trip' }).click();

    await expect(page).toHaveURL(/\/trips\/[0-9]+/i);

    const signUpBtn = page.getByRole('button', { name: 'Sign up to save' })
    await expect(signUpBtn).toBeHidden()

    await page.getByRole('button', { name: 'Trips' }).click();

    await page.getByRole('tab', { name: 'UPCOMING' }).click()

    await expect(page.getByText(itineraryName)).toBeVisible()
})