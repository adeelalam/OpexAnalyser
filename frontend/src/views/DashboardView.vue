<script setup lang="ts">
import { Wallet, TrendingUp, CircleDollarSign, ChartNoAxesCombined } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'

import MonthlyExpensesChart from '@/components/dashboard/MonthlyExpensesChart.vue'
import CreateExpenseForm from '@/components/expenses/CreateExpenseForm.vue'

import { getExpenses, createExpense, type Expense } from '@/services/expenseService'

import type { CreateExpenseInput } from '@/components/expenses/CreateExpenseForm.vue'

const summaryCards = [
  {
    title: 'Total Expenses',
    amount: 'SEK 245,800',
    description: 'This month',
    icon: Wallet,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Monthly Budget',
    amount: 'SEK 350,000',
    description: 'Allocated budget',
    icon: CircleDollarSign,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Remaining Budget',
    amount: 'SEK 104,200',
    description: 'Budget available',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Budget Utilization',
    amount: '70.2%',
    description: 'Of monthly budget',
    icon: ChartNoAxesCombined,
    color: 'bg-orange-100 text-orange-600',
  },
]

const monthlyExpenses = [
  { month: 'Jun', amount: 45 },
  { month: 'Jul', amount: 65 },
  { month: 'Aug', amount: 55 },
  { month: 'Sep', amount: 80 },
  { month: 'Oct', amount: 70 },
  { month: 'Nov', amount: 95 },
]

const recentExpenses = [
  {
    description: 'Office Supplies',
    department: 'Administration',
    category: 'Supplies',
    amount: 'SEK 4,500',
    status: 'Approved',
  },
  {
    description: 'Cloud Hosting',
    department: 'IT',
    category: 'Infrastructure',
    amount: 'SEK 12,000',
    status: 'Approved',
  },
  {
    description: 'Business Travel',
    department: 'Sales',
    category: 'Travel',
    amount: 'SEK 8,200',
    status: 'Pending',
  },
  {
    description: 'Software Licenses',
    department: 'IT',
    category: 'Software',
    amount: 'SEK 6,800',
    status: 'Approved',
  },
]

const expenses = ref<Expense[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

const loadExpenses = async () => {
  const showExpenseForm = ref(false)
  const isCreatingExpense = ref(false)
  const successMessage = ref('')

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

const showExpenseForm = ref(false)
const isCreatingExpense = ref(false)
const successMessage = ref('')

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
            <span class="font-semibold text-slate-800">70.2%</span>
          </div>

          <div class="h-3 overflow-hidden rounded-full bg-slate-100">
            <div class="h-full w-[70.2%] rounded-full bg-blue-500" />
          </div>

          <div class="mt-6 space-y-4 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Spent</span>
              <span class="font-semibold">SEK 245,800</span>
            </div>

            <div class="flex justify-between">
              <span class="text-slate-500">Remaining</span>
              <span class="font-semibold text-green-600"> SEK 104,200 </span>
            </div>

            <div class="flex justify-between border-t border-slate-100 pt-4">
              <span class="text-slate-500">Total budget</span>
              <span class="font-semibold">SEK 350,000</span>
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
              v-for="expense in expenses.slice(0, 5)"
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
