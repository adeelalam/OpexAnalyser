<script setup lang="ts">
import { reactive, ref } from 'vue'

export interface CreateExpenseInput {
  description: string
  amount: number
  category: string
  department: string
  expenseDate: string
}

const emit = defineEmits<{
  submit: [expense: CreateExpenseInput]
  cancel: []
}>()

const props = defineProps<{
  isSubmitting: boolean
}>()
const errorMessage = ref('')

const form = reactive<CreateExpenseInput>({
  description: '',
  amount: 0,
  category: '',
  department: '',
  expenseDate: new Date().toISOString().slice(0, 10),
})

const submitForm = () => {
  errorMessage.value = ''

  if (
    !form.description.trim() ||
    !form.category.trim() ||
    !form.department.trim() ||
    !Number.isFinite(form.amount) ||
    form.amount <= 0 ||
    !form.expenseDate
  ) {
    errorMessage.value = 'Please complete all fields with valid values.'
    return
  }

  emit('submit', {
    ...form,
    description: form.description.trim(),
    category: form.category.trim(),
    department: form.department.trim(),
  })
}
</script>

<template>
  <form
    class="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    @submit.prevent="submitForm"
  >
    <div>
      <h2 class="text-lg font-semibold text-slate-900">Create Expense</h2>
      <p class="mt-1 text-sm text-slate-500">Enter the details of your expense.</p>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Description</label>
      <input
        v-model="form.description"
        type="text"
        placeholder="e.g. Office supplies"
        class="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Amount (SEK)</label>
      <input
        v-model.number="form.amount"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="4500"
        class="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Category</label>
      <input
        v-model="form.category"
        type="text"
        placeholder="e.g. Travel"
        class="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Department</label>
      <input
        v-model="form.department"
        type="text"
        placeholder="e.g. IT"
        class="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Expense date</label>
      <input
        v-model="form.expenseDate"
        type="date"
        class="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <div class="flex justify-end gap-3">
      <button
        type="button"
        class="rounded-lg border border-slate-300 px-4 py-2 text-sm"
        @click="emit('cancel')"
      >
        Cancel
      </button>

      <button
        type="submit"
        :disabled="props.isSubmitting"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {{ props.isSubmitting ? 'Saving...' : 'Save Expense' }}
      </button>
    </div>
  </form>
</template>
