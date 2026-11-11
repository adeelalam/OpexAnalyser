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

test('authenticated user can search expenses by description', async ({ page }) => {
  const email = `playwright-search-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const description = `Searchable Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Search User')
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

  // Navigate to expenses
  await page.goto('/expenses')

  // Search for the expense
  await page.getByPlaceholder('Search expenses...').fill(description)

  // Verify the matching expense appears
  await expect(page.getByRole('cell', { name: description })).toBeVisible()

  // Search for a description that does not exist
  await page.getByPlaceholder('Search expenses...').fill('Nonexistent Expense XYZ')

  // Verify no matching results
  await expect(page.getByText('No expenses match your filters.')).toBeVisible()
})

test('authenticated user can filter expenses by category', async ({ page }) => {
  const email = `playwright-category-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const travelDescription = `Travel Expense ${Date.now()}`
  const officeDescription = `Office Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Category User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create the first expense: Travel
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(travelDescription)
  await page.getByPlaceholder('4500').fill('2500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Create the second expense: Office
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(officeDescription)
  await page.getByPlaceholder('4500').fill('1800')
  await page.getByPlaceholder('e.g. Travel').fill('Office')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to expenses
  await page.goto('/expenses')

  const travelRow = page.getByRole('row').filter({
    hasText: travelDescription,
  })

  const officeRow = page.getByRole('row').filter({
    hasText: officeDescription,
  })

  await expect(travelRow).toBeVisible()
  await expect(officeRow).toBeVisible()

  // Apply the Travel category filter
  // Select 0 is pagination; select 1 is Category.
  await page.locator('select').nth(1).selectOption('Travel')

  // Verify only Travel expenses are displayed
  await expect(travelRow).toBeVisible()
  await expect(officeRow).toBeHidden()
})

test('authenticated user can filter expenses by department', async ({ page }) => {
  const email = `playwright-department-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const itDescription = `IT Expense ${Date.now()}`
  const hrDescription = `HR Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Department User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create the first expense: IT department
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(itDescription)
  await page.getByPlaceholder('4500').fill('2500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Create the second expense: HR department
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(hrDescription)
  await page.getByPlaceholder('4500').fill('1800')
  await page.getByPlaceholder('e.g. Travel').fill('Office')
  await page.getByPlaceholder('e.g. IT').fill('HR')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to expenses
  await page.goto('/expenses')

  const itRow = page.getByRole('row').filter({
    hasText: itDescription,
  })

  const hrRow = page.getByRole('row').filter({
    hasText: hrDescription,
  })

  await expect(itRow).toBeVisible()
  await expect(hrRow).toBeVisible()

  // Apply the HR department filter
  // Select 0 is pagination; select 1 is Category; select 2 is Department.
  await page.locator('select').nth(2).selectOption('HR')

  // Verify only HR expenses are displayed
  await expect(hrRow).toBeVisible()
  await expect(itRow).toBeHidden()
})

test('authenticated user can filter expenses by date range', async ({ page }) => {
  const email = `playwright-date-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const recentDescription = `Recent Expense ${Date.now()}`
  const olderDescription = `Older Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Date User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create an older expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(olderDescription)
  await page.getByPlaceholder('4500').fill('1500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-08')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Create a more recent expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(recentDescription)
  await page.getByPlaceholder('4500').fill('2500')
  await page.getByPlaceholder('e.g. Travel').fill('Office')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to expenses
  await page.goto('/expenses')

  const olderRow = page.getByRole('row').filter({
    hasText: olderDescription,
  })

  const recentRow = page.getByRole('row').filter({
    hasText: recentDescription,
  })

  await expect(olderRow).toBeVisible()
  await expect(recentRow).toBeVisible()

  // Apply the From date filter
  // The first date input is From date; the second is To date.
  await page.locator('input[type="date"]').nth(0).fill('2026-11-09')

  // Verify only expenses from November 9 onward appear
  await expect(recentRow).toBeVisible()
  await expect(olderRow).toBeHidden()
})

test('authenticated user can reset expense filters', async ({ page }) => {
  const email = `playwright-reset-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const targetDescription = `Reset Filter Target ${Date.now()}`
  const otherDescription = `Other Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Reset User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create the first expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(targetDescription)
  await page.getByPlaceholder('4500').fill('1500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Create the second expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(otherDescription)
  await page.getByPlaceholder('4500').fill('2500')
  await page.getByPlaceholder('e.g. Travel').fill('Office')
  await page.getByPlaceholder('e.g. IT').fill('HR')
  await page.locator('input[type="date"]').fill('2026-11-08')

  await page.getByRole('button', { name: 'Save Expense' }).click()

  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to expenses
  await page.goto('/expenses')

  const targetRow = page.getByRole('row').filter({
    hasText: targetDescription,
  })

  const otherRow = page.getByRole('row').filter({
    hasText: otherDescription,
  })

  await expect(targetRow).toBeVisible()
  await expect(otherRow).toBeVisible()

  // Apply multiple filters
  await page.getByPlaceholder('Search expenses...').fill(targetDescription)
  await page.locator('select').nth(1).selectOption('Travel')
  await page.locator('select').nth(2).selectOption('IT')
  await page.locator('input[type="date"]').nth(0).fill('2026-11-09')
  await page.locator('input[type="date"]').nth(1).fill('2026-11-11')

  // Only the matching expense should remain
  await expect(targetRow).toBeVisible()
  await expect(otherRow).toBeHidden()

  // Reset all filters
  await page.getByRole('button', { name: 'Reset filters' }).click()

  // Both expenses should be visible again
  await expect(targetRow).toBeVisible()
  await expect(otherRow).toBeVisible()

  // Verify filter controls are cleared
  await expect(page.getByPlaceholder('Search expenses...')).toHaveValue('')
  await expect(page.locator('select').nth(1)).toHaveValue('')
  await expect(page.locator('select').nth(2)).toHaveValue('')
  await expect(page.locator('input[type="date"]').nth(0)).toHaveValue('')
  await expect(page.locator('input[type="date"]').nth(1)).toHaveValue('')
})

test('authenticated user can sort expenses by amount', async ({ page }) => {
  const email = `playwright-sort-amount-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const lowDescription = `Low Amount ${Date.now()}`
  const highDescription = `High Amount ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Sort User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create a low-value expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(lowDescription)
  await page.getByPlaceholder('4500').fill('100')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()
  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Create a high-value expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(highDescription)
  await page.getByPlaceholder('4500').fill('900')
  await page.getByPlaceholder('e.g. Travel').fill('Office')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()
  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to expenses
  await page.goto('/expenses')

  const lowRow = page.getByRole('row').filter({
    hasText: lowDescription,
  })

  const highRow = page.getByRole('row').filter({
    hasText: highDescription,
  })

  await expect(lowRow).toBeVisible()
  await expect(highRow).toBeVisible()

  // Select amount sorting (default direction: descending)
  await page.locator('select').nth(3).selectOption('amount')

  let rows = await page.getByRole('row').allTextContents()

  // Verify descending order: high amount first
  expect(rows.findIndex((row) => row.includes(highDescription))).toBeLessThan(
    rows.findIndex((row) => row.includes(lowDescription)),
  )

  // Toggle to ascending order
  await page.getByRole('button', { name: /Descending/ }).click()

  rows = await page.getByRole('row').allTextContents()

  // Verify ascending order: low amount first
  expect(rows.findIndex((row) => row.includes(lowDescription))).toBeLessThan(
    rows.findIndex((row) => row.includes(highDescription)),
  )
})

test('authenticated user can sort expenses by description', async ({ page }) => {
  const email = `playwright-sort-description-${Date.now()}@example.com`
  const password = 'TestPassword123!'
  const alphaDescription = `Alpha Expense ${Date.now()}`
  const betaDescription = `Beta Expense ${Date.now()}`

  // Register a test account
  await page.goto('/register')

  await page.getByPlaceholder('Your name').fill('Playwright Description User')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Minimum 8 characters').fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('http://localhost:5173/')

  // Create Alpha expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(alphaDescription)
  await page.getByPlaceholder('4500').fill('500')
  await page.getByPlaceholder('e.g. Travel').fill('Travel')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()
  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Create Beta expense
  await page.getByRole('button', { name: /Add Expense/ }).click()

  await page.getByPlaceholder('e.g. Office supplies').fill(betaDescription)
  await page.getByPlaceholder('4500').fill('700')
  await page.getByPlaceholder('e.g. Travel').fill('Office')
  await page.getByPlaceholder('e.g. IT').fill('IT')
  await page.locator('input[type="date"]').fill('2026-11-10')

  await page.getByRole('button', { name: 'Save Expense' }).click()
  await expect(page.getByText('Expense created successfully!')).toBeVisible()

  // Navigate to expenses
  await page.goto('/expenses')

  const alphaRow = page.getByRole('row').filter({
    hasText: alphaDescription,
  })

  const betaRow = page.getByRole('row').filter({
    hasText: betaDescription,
  })

  await expect(alphaRow).toBeVisible()
  await expect(betaRow).toBeVisible()

  // Select description sorting (default direction: descending)
  await page.locator('select').nth(3).selectOption('description')

  let rows = await page.getByRole('row').allTextContents()

  // Verify descending alphabetical order: Beta before Alpha
  expect(rows.findIndex((row) => row.includes(betaDescription))).toBeLessThan(
    rows.findIndex((row) => row.includes(alphaDescription)),
  )

  // Toggle to ascending order
  await page.getByRole('button', { name: /Descending/ }).click()

  rows = await page.getByRole('row').allTextContents()

  // Verify ascending alphabetical order: Alpha before Beta
  expect(rows.findIndex((row) => row.includes(alphaDescription))).toBeLessThan(
    rows.findIndex((row) => row.includes(betaDescription)),
  )
})
