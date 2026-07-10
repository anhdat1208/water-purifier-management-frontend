<script setup lang="ts">
import type { FilterLifeTrendPoint } from '~/features/dashboard/types/dashboard'

interface Props {
  data: FilterLifeTrendPoint[]
}

const props = defineProps<Props>()

const option = computed(() => ({
  color: ['#2563eb'],
  grid: { left: 40, right: 16, top: 24, bottom: 32 },
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value: number) => `${value}%`
  },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.label),
    axisLine: { lineStyle: { color: '#cbd5e1' } },
    axisLabel: { color: '#64748b' }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: { formatter: '{value}%', color: '#64748b' },
    splitLine: { lineStyle: { color: '#e2e8f0' } }
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: props.data.map((item) => item.value),
      areaStyle: { color: 'rgba(37, 99, 235, 0.08)' },
      lineStyle: { width: 3 }
    }
  ]
}))
</script>

<template>
  <AppCard>
    <template #title>Xu hướng tuổi thọ lõi lọc</template>
    <p class="mb-4 text-sm text-slate-500">Trung bình 7 ngày gần nhất</p>
    <ClientOnly>
      <AppChart chart-class="h-72 w-full" :option="option" />
    </ClientOnly>
  </AppCard>
</template>
