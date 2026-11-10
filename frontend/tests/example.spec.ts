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

test('user can log in with valid credentials', async ({ page }) => {
  const email = `playwright-login-${Date.now()}@example.com`
  const password = 'TestPassword123!'

  // First, register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Login User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Log out
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL(/\/login$/)

  // Then, log in with the same credentials
  await page.goto('/login')

  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Enter your password').fill(password)

  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  await expect(page.getByRole('banner').getByText('Playwright Login User')).toBeVisible()
})

test('authenticated user can view the expenses page', async ({ page }) => {
  const email = `playwright-expenses-${Date.now()}@example.com`
  const password = 'TestPassword123!'

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Expense User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Navigate to expenses
  await page.goto('/expenses')

  // Verify the expenses page
  await expect(page.getByRole('heading', { name: 'Expenses', exact: true })).toBeVisible()

  await expect(page.getByRole('heading', { name: 'All Expenses' })).toBeVisible()
})
