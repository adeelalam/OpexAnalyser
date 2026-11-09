<script setup lang="ts">
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  labels: string[]
  amounts: number[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.amounts,
      backgroundColor: [
        '#3b82f6',
        '#8b5cf6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#06b6d4',
        '#ec4899',
        '#64748b',
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = Number(context.parsed)
          return `SEK ${value.toLocaleString('sv-SE')}`
        },
      },
    },
  },
}
</script>

<template>
  <div class="relative h-72 w-full">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
