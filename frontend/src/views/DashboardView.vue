<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Wallet, TrendingUp, CircleDollarSign, ChartNoAxesCombined } from 'lucide-vue-next'

import MonthlyExpensesChart from '@/components/dashboard/MonthlyExpensesChart.vue'
import CreateExpenseForm from '@/components/expenses/CreateExpenseForm.vue'

import { getExpenses, createExpense, type Expense } from '@/services/expenseService'

import type { CreateExpenseInput } from '@/components/expenses/CreateExpenseForm.vue'

// Temporary monthly budget.
// We will make this configurable later.
const monthlyBudget = 350000

const expenses = ref<Expense[]>([])
const isLoading = ref(false)
const isCreatingExpense = ref(false)
const showExpenseForm = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Format amounts consistently.
const formatAmount = (amount: number) =>
  `SEK ${amount.toLocaleString('sv-SE', {
    maximumFractionDigits: 0,
  })}`

// Current month in YYYY-MM format.
const currentMonth = new Date().toISOString().slice(0, 7)

// Expenses recorded during the current month.
const currentMonthExpenses = computed(() =>
  expenses.value.filter((expense) => expense.expenseDate.slice(0, 7) === currentMonth),
)

// Total expenses for the current month.
const totalMonthlyExpenses = computed(() =>
  currentMonthExpenses.value.reduce((total, expense) => total + expense.amount, 0),
)

// Remaining budget.
const remainingBudget = computed(() => monthlyBudget - totalMonthlyExpenses.value)

// Budget utilization percentage.
const budgetUtilization = computed(() =>
  monthlyBudget > 0 ? (totalMonthlyExpenses.value / monthlyBudget) * 100 : 0,
)

// Summary cards.
const summaryCards = computed(() => [
  {
    title: 'Total Expenses',
    amount: formatAmount(totalMonthlyExpenses.value),
    description: 'This month',
    icon: Wallet,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Monthly Budget',
    amount: formatAmount(monthlyBudget),
    description: 'Allocated budget',
    icon: CircleDollarSign,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Remaining Budget',
    amount: formatAmount(remainingBudget.value),
    description: 'Budget available',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Budget Utilization',
    amount: `${budgetUtilization.value.toFixed(1)}%`,
    description: 'Of monthly budget',
    icon: ChartNoAxesCombined,
    color: 'bg-orange-100 text-orange-600',
  },
])

// Generate the last six calendar months, including the current month.
const monthlyExpenses = computed(() => {
  const today = new Date()

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1)

    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: 0,
    }
  })

  expenses.value.forEach((expense) => {
    const month = months.find((item) => item.key === expense.expenseDate.slice(0, 7))

    if (month) {
      month.amount += expense.amount
    }
  })

  return months
})

// Latest five expenses.
const recentExpenses = computed(() =>
  [...expenses.value].sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)).slice(0, 5),
)

const loadExpenses = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    expenses.value = await getExpenses()
  } catch (error) {
    console.error('Failed to load expenses:', error)
    errorMessage.value = 'Unable to load expenses. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleCreateExpense = async (expense: CreateExpenseInput) => {
  isCreatingExpense.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await createExpense(expense)

    showExpenseForm.value = false
    successMessage.value = 'Expense created successfully!'

    await loadExpenses()
  } catch (error) {
    console.error('Failed to create expense:', error)
    errorMessage.value = 'Unable to create expense. Please try again.'
  } finally {
    isCreatingExpense.value = false
  }
}

onMounted(() => {
  loadExpenses()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Page heading -->
    <!-- Page heading -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">
          Overview of your organization's operating expenses.
        </p>
      </div>

      <button
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        @click="showExpenseForm = !showExpenseForm"
      >
        {{ showExpenseForm ? 'Close Form' : '+ Add Expense' }}
      </button>
    </div>

    <!-- Create expense form -->
    <section v-if="showExpenseForm">
      <CreateExpenseForm
        :is-submitting="isCreatingExpense"
        @submit="handleCreateExpense"
        @cancel="showExpenseForm = false"
      />
    </section>

    <!-- Success message -->
    <div v-if="successMessage" class="rounded-lg bg-green-50 p-4 text-sm text-green-700">
      {{ successMessage }}
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in summaryCards"
        :key="card.title"
        class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-500">
            {{ card.title }}
          </p>

          <div :class="['rounded-lg p-3', card.color]">
            <component :is="card.icon" :size="22" />
          </div>
        </div>

        <h2 class="mt-5 text-2xl font-bold text-slate-800">
          {{ card.amount }}
        </h2>

        <p class="mt-2 text-xs text-slate-500">
          {{ card.description }}
        </p>
      </div>
    </div>

    <!-- Charts and budget overview -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <h2 class="text-lg font-semibold text-slate-800">Monthly Expenses</h2>

        <p class="mt-1 text-sm text-slate-500">Expense trend over the last six months</p>

        <div class="mt-8">
          <MonthlyExpensesChart
            :labels="monthlyExpenses.map((item) => item.month)"
            :amounts="monthlyExpenses.map((item) => item.amount)"
          />
        </div>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-800">Budget Overview</h2>

        <p class="mt-1 text-sm text-slate-500">Monthly budget utilization</p>

        <div class="mt-8">
          <div class="mb-3 flex justify-between text-sm">
            <span class="text-slate-500">Used budget</span>
            <span class="font-semibold text-slate-800"> {{ budgetUtilization.toFixed(1) }}% </span>
          </div>

          <div class="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full bg-blue-500 transition-all"
              :style="{ width: `${Math.min(budgetUtilization, 100)}%` }"
            />
          </div>

          <div class="mt-6 space-y-4 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Spent</span>
              <span class="font-semibold">
                {{ formatAmount(totalMonthlyExpenses) }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-slate-500">Remaining</span>
              <span class="font-semibold text-green-600">
                {{ formatAmount(remainingBudget) }}
              </span>
            </div>

            <div class="flex justify-between border-t border-slate-100 pt-4">
              <span class="text-slate-500">Total budget</span>
              <span class="font-semibold">
                {{ formatAmount(monthlyBudget) }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Recent expenses -->
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between p-6">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">Recent Expenses</h2>
          <p class="mt-1 text-sm text-slate-500">Latest recorded transactions</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th class="px-6 py-4">Description</th>
              <th class="px-6 py-4">Department</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Amount</th>
              <th class="px-6 py-4">Expense Date</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading expenses...</td>
            </tr>

            <tr v-else-if="errorMessage">
              <td colspan="5" class="px-6 py-8 text-center text-red-500">
                {{ errorMessage }}
              </td>
            </tr>

            <tr v-else-if="expenses.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">No expenses found.</td>
            </tr>

            <tr
              v-else
              v-for="expense in recentExpenses"
              :key="expense.id"
              class="border-t border-slate-100"
            >
              <td class="px-6 py-4">{{ expense.description }}</td>
              <td class="px-6 py-4">{{ expense.department }}</td>
              <td class="px-6 py-4">{{ expense.category }}</td>
              <td class="px-6 py-4">{{ expense.amount.toLocaleString('sv-SE') }} SEK</td>
              <td class="px-6 py-4">
                {{ new Date(expense.expenseDate).toLocaleDateString('sv-SE') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
