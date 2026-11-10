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

test('authenticated user can create an expense', async ({ page }) => {
  const email = `playwright-create-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const description = `Playwright Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Expense User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Open the create expense form
  await page.getByRole('button', { name: /Add Expense/ }).click()

  // Fill in the expense details
  await page.getByPlaceholder('e.g. Office supplies').fill(description)
  await page.getByPlaceholder('4500').fill('2500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  // Submit the expense
  await page.getByRole('button', { name: 'Save Expense' }).click()

  // Verify successful creation
  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to the expenses list
  await page.goto('/expenses')

  // Verify the new expense appears
  await expect(page.getByRole('cell', { name: description })).toBeVisible()
})

test('authenticated user can edit an expense', async ({ page }) => {
  const email = `playwright-edit-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const description = `Original Expense ${Date.now()}`
  const updatedDescription = `Updated Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Edit User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create an expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(description)
  await page.getByPlaceholder('4500').fill('2500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Open the Expenses page
  await page.goto('/expenses')

  const expenseRow = page.getByRole('row').filter({
    hasText: description,
  })

  await expect(expenseRow).toBeVisible()

  // Edit the expense
  await expenseRow.getByRole('button', { name: /edit/i }).click()

  await page.locator('input[type="text"]').last().fill(updatedDescription)
  await page.locator('input[type="number"]').fill('3500')

  await page.getByRole('button', { name: 'Save Changes' }).click()

  // Verify the update
  await expect(page.getByText('Expense updated successfully!')).toBeVisible()

  const updatedRow = page.getByRole('row').filter({
    hasText: updatedDescription,
  })

  await expect(updatedRow).toBeVisible()
  await expect(updatedRow).toContainText('3')
})

test('authenticated user can delete an expense', async ({ page }) => {
  const email = `playwright-delete-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const description = `Playwright Delete Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Delete User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create an expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(description)
  await page.getByPlaceholder('4500').fill('1500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to the expenses list
  await page.goto('/expenses')

  const expenseRow = page.getByRole('row').filter({
    hasText: description,
  })

  await expect(expenseRow).toBeVisible()

  // Accept the browser confirmation dialog
  page.once('dialog', (dialog) => dialog.accept())

  // Delete the expense
  await expenseRow.getByRole('button', { name: /delete/i }).click()

  // Verify that the expense disappears
  await expect(expenseRow).toBeHidden()
})
