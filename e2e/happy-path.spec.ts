import { test, expect } from '@playwright/test'

test('search -> offer -> checkout -> confirm (mocked)', async ({ page }) => {
  await page.goto('/search/flights')
  await page.getByPlaceholder('Origin (e.g. SFO)').fill('SFO')
  await page.getByPlaceholder('Destination (e.g. LAX)').fill('LAX')
  await page.locator('input[type="date"]').fill('2025-10-01')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('link', { name: 'Select' }).first()).toBeVisible()
  await page.getByRole('link', { name: 'Select' }).first().click()
  await page.getByRole('button', { name: 'Recheck availability' }).click()
  await page.getByRole('button', { name: 'Proceed to checkout' }).click()
  await page.getByRole('button', { name: 'Create payment intent' }).click()
  await page.getByRole('button', { name: 'Confirm and book' }).click()
  await expect(page.getByText('Booking Confirmed')).toBeVisible()
})
