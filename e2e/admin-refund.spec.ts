import { test, expect } from '@playwright/test'

test('admin refund mocked', async ({ page }) => {
  await page.goto('/admin')
  await page.getByRole('link', { name: 'Open' }).first().click()
  await page.waitForURL(/\/admin\/.+/)
  const refundBtn = page.getByRole('button', { name: 'Refund' })
  await expect(refundBtn).toBeVisible()
  await refundBtn.click()
  await expect(refundBtn).toBeDisabled()
})
