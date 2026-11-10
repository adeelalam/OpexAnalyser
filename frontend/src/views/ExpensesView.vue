<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  getExpenses,
  updateExpense,
  deleteExpense,
  exportExpenses,
  type Expense,
} from '@/services/expenseService'

type ExpenseFormData = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>

const expenses = ref<Expense[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isExporting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editExpenseId = ref<string | null>(null)
const isDeletingExpenseId = ref<string | null>(null)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDepartment = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const sortBy = ref<'description' | 'amount' | 'expenseDate'>('expenseDate')
const sortDirection = ref<'asc' | 'desc'>('desc')

const currentPage = ref(1)
const pageSize = ref(10)

const categories = computed(() =>
  [...new Set(expenses.value.map((expense) => expense.category))].sort(),
)

const departments = computed(() =>
  [...new Set(expenses.value.map((expense) => expense.department))].sort(),
)

const filteredExpenses = computed(() => {
  return expenses.value.filter((expense) => {
    const search = searchQuery.value.trim().toLowerCase()

    const matchesSearch = !search || expense.description.toLowerCase().includes(search)

    const matchesCategory = !selectedCategory.value || expense.category === selectedCategory.value

    const matchesDepartment =
      !selectedDepartment.value || expense.department === selectedDepartment.value

    const expenseDate = expense.expenseDate.slice(0, 10)

    const matchesDateFrom = !dateFrom.value || expenseDate >= dateFrom.value

    const matchesDateTo = !dateTo.value || expenseDate <= dateTo.value

    return matchesSearch && matchesCategory && matchesDepartment && matchesDateFrom && matchesDateTo
  })
})

const sortedExpenses = computed(() => {
  return [...filteredExpenses.value].sort((a, b) => {
    let comparison = 0

    if (sortBy.value === 'amount') {
      comparison = a.amount - b.amount
    } else if (sortBy.value === 'description') {
      comparison = a.description.localeCompare(b.description)
    } else {
      comparison = a.expenseDate.localeCompare(b.expenseDate)
    }

    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedExpenses.value.length / pageSize.value)),
)

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value

  return sortedExpenses.value.slice(start, start + pageSize.value)
})

const pageStart = computed(() =>
  sortedExpenses.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1,
)

const pageEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, sortedExpenses.value.length),
)

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

watch(filteredExpenses, () => {
  currentPage.value = 1
})

watch(pageSize, () => {
  currentPage.value = 1
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedDepartment.value = ''
  dateFrom.value = ''
  dateTo.value = ''
}

const editForm = reactive<ExpenseFormData>({
  description: '',
  amount: 0,
  category: '',
  department: '',
  expenseDate: '',
})

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

const startEditing = (expense: Expense) => {
  editExpenseId.value = expense.id
  successMessage.value = ''
  errorMessage.value = ''

  editForm.description = expense.description
  editForm.amount = expense.amount
  editForm.category = expense.category
  editForm.department = expense.department
  editForm.expenseDate = expense.expenseDate.slice(0, 10)
}

const cancelEditing = () => {
  editExpenseId.value = null
  editForm.description = ''
  editForm.amount = 0
  editForm.category = ''
  editForm.department = ''
  editForm.expenseDate = ''
}

const handleUpdateExpense = async () => {
  if (!editExpenseId.value) return

  if (
    !editForm.description.trim() ||
    !editForm.category.trim() ||
    !editForm.department.trim() ||
    !Number.isFinite(editForm.amount) ||
    editForm.amount <= 0 ||
    !editForm.expenseDate
  ) {
    errorMessage.value = 'Please enter valid values in all fields.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await updateExpense(editExpenseId.value, {
      ...editForm,
      description: editForm.description.trim(),
      category: editForm.category.trim(),
      department: editForm.department.trim(),
    })

    cancelEditing()
    successMessage.value = 'Expense updated successfully!'

    await loadExpenses()
  } catch (error) {
    console.error('Failed to update expense:', error)
    errorMessage.value = 'Unable to update expense. Please try again.'
  } finally {
    isSaving.value = false
  }
}

const handleDeleteExpense = async (expense: Expense) => {
  const confirmed = window.confirm(`Are you sure you want to delete "${expense.description}"?`)

  if (!confirmed) return

  isDeletingExpenseId.value = expense.id
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await deleteExpense(expense.id)

    successMessage.value = 'Expense deleted successfully!'

    await loadExpenses()
  } catch (error) {
    console.error('Failed to delete expense:', error)
    errorMessage.value = 'Unable to delete expense. Please try again.'
  } finally {
    isDeletingExpenseId.value = null
  }
}

const handleExportExpenses = async () => {
  isExporting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await exportExpenses()
    successMessage.value = 'Expenses exported successfully!'
  } catch (error) {
    console.error('Failed to export expenses:', error)
    errorMessage.value = 'Unable to export expenses. Please try again.'
  } finally {
    isExporting.value = false
  }
}

const formatAmount = (amount: number) => {
  return `${amount.toLocaleString('sv-SE')} SEK`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sv-SE')
}

onMounted(() => {
  loadExpenses()
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Expenses</h1>
      <p class="mt-2 text-slate-500">Manage operating expenses.</p>
    </div>

    <div v-if="successMessage" class="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <!-- Edit expense form -->
    <section
      v-if="editExpenseId"
      class="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="mb-5 text-lg font-semibold text-slate-800">Edit Expense</h2>

      <form @submit.prevent="handleUpdateExpense">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"> Description </label>
            <input
              v-model="editForm.description"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"> Amount (SEK) </label>
            <input
              v-model.number="editForm.amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"> Category </label>
            <input
              v-model="editForm.category"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"> Department </label>
            <input
              v-model="editForm.department"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"> Expense Date </label>
            <input
              v-model="editForm.expenseDate"
              type="date"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        <div class="mt-5 flex gap-3">
          <button
            type="submit"
            :disabled="isSaving"
            class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>

          <button
            type="button"
            :disabled="isSaving"
            class="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="cancelEditing"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>

    <!-- Expenses table -->
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4"
      >
        <div>
          <h2 class="text-lg font-semibold text-slate-800">All Expenses</h2>
          <p class="mt-1 text-sm text-slate-500">{{ expenses.length }} expense(s) found</p>
        </div>

        <button
          type="button"
          :disabled="isExporting || expenses.length === 0"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleExportExpenses"
        >
          {{ isExporting ? 'Exporting...' : 'Export CSV' }}
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-slate-500">Loading expenses...</div>

      <div v-else-if="expenses.length === 0" class="p-8 text-center text-slate-500">
        No expenses found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-6 py-3 font-semibold">Description</th>
              <th class="px-6 py-3 font-semibold">Category</th>
              <th class="px-6 py-3 font-semibold">Department</th>
              <th class="px-6 py-3 text-right font-semibold">Amount</th>
              <th class="px-6 py-3 font-semibold">Expense Date</th>
              <th class="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="expense in paginatedExpenses" :key="expense.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-medium text-slate-800">
                {{ expense.description }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ expense.category }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ expense.department }}
              </td>
              <td class="px-6 py-4 text-right font-medium text-slate-800">
                {{ formatAmount(expense.amount) }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ formatDate(expense.expenseDate) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-3">
                  <button
                    class="font-medium text-blue-600 hover:text-blue-800"
                    @click="startEditing(expense)"
                  >
                    Edit
                  </button>

                  <button
                    :disabled="isDeletingExpenseId === expense.id"
                    class="font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="handleDeleteExpense(expense)"
                  >
                    {{ isDeletingExpenseId === expense.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div
        v-if="filteredExpenses.length > 0"
        class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-6 py-4"
      >
        <div class="flex items-center gap-3 text-sm text-slate-600">
          <span>
            Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredExpenses.length }} expenses
          </span>

          <select v-model.number="pageSize" class="rounded-lg border border-slate-300 px-2 py-1">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>per page</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="currentPage === 1"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            @click="currentPage--"
          >
            Previous
          </button>

          <span class="text-sm text-slate-600"> Page {{ currentPage }} of {{ totalPages }} </span>

          <button
            type="button"
            :disabled="currentPage >= totalPages"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Expense filters -->
    <div class="grid grid-cols-1 gap-4 border-b border-slate-200 p-6 md:grid-cols-2 lg:grid-cols-3">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700"> Search description </label>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search expenses..."
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700"> Category </label>
        <select
          v-model="selectedCategory"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">All categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700"> Department </label>
        <select
          v-model="selectedDepartment"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">All departments</option>
          <option v-for="department in departments" :key="department" :value="department">
            {{ department }}
          </option>
        </select>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700"> From date </label>
        <input
          v-model="dateFrom"
          type="date"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700"> To date </label>
        <input
          v-model="dateTo"
          type="date"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div class="flex items-end">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="resetFilters"
        >
          Reset filters
        </button>
      </div>
    </div>

    <!-- Sorting controls -->
    <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 p-6">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700"> Sort by </label>

        <select v-model="sortBy" class="rounded-lg border border-slate-300 px-3 py-2">
          <option value="expenseDate">Expense Date</option>
          <option value="description">Description</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      <button
        type="button"
        class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        @click="toggleSortDirection"
      >
        {{ sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending' }}
      </button>
    </div>
  </div>

  {{ filteredExpenses.length }} matching expense(s)

  <div v-if="filteredExpenses.length === 0" class="p-8 text-center text-slate-500">
    {{ expenses.length === 0 ? 'No expenses found.' : 'No expenses match your filters.' }}
  </div>
</template>
