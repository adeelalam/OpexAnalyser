<script setup lang="ts">
import { Wallet, TrendingUp, CircleDollarSign, ChartNoAxesCombined } from 'lucide-vue-next'

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
</script>

<template>
  <div class="space-y-8">
    <!-- Page heading -->
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p class="mt-1 text-sm text-slate-500">Overview of your organization's operating expenses.</p>
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

        <div class="mt-8 flex h-56 items-end justify-around gap-4">
          <div
            v-for="item in monthlyExpenses"
            :key="item.month"
            class="flex h-full flex-1 flex-col items-center justify-end gap-3"
          >
            <div
              class="w-full max-w-12 rounded-t-lg bg-blue-500 transition-all hover:bg-blue-600"
              :style="{ height: `${item.amount}%` }"
            />

            <span class="text-xs text-slate-500">
              {{ item.month }}
            </span>
          </div>
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
              <th class="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="expense in recentExpenses" :key="expense.description">
              <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                {{ expense.description }}
              </td>

              <td class="whitespace-nowrap px-6 py-4 text-slate-600">
                {{ expense.department }}
              </td>

              <td class="whitespace-nowrap px-6 py-4 text-slate-600">
                {{ expense.category }}
              </td>

              <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                {{ expense.amount }}
              </td>

              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="[
                    'rounded-full px-3 py-1 text-xs font-medium',
                    expense.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700',
                  ]"
                >
                  {{ expense.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
