import { test, expect } from '@playwright/test'

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/login$/)

  await expect(page.getByRole('heading', { name: 'OpexAnalyser' })).toBeVisible()
})

test('user can register a new account', async ({ page }) => {
  const email = `playwright-${Date.now()}@example.com`

  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Test User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill('TestPassword123!')

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  await expect(page.getByRole('banner').getByText('Playwright Test User')).toBeVisible()
})
