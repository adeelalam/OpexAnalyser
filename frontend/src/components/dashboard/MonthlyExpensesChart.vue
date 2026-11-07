<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  amounts: number[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Monthly Expenses',
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      data: props.amounts,
      barThickness: 35,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: { parsed: { y: number } }) =>
          `SEK ${context.parsed.y.toLocaleString('sv-SE')}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: string | number) => `SEK ${Number(value).toLocaleString('sv-SE')}`,
      },
      grid: {
        color: '#e2e8f0',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}
</script>

<template>
  <div class="relative h-64 w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
