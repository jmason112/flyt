import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('home has no critical a11y issues', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter(v => v.impact === 'critical')).toEqual([])
})
