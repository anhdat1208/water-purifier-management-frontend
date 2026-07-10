<script setup lang="ts">
import type { StatusDistribution } from '~/features/dashboard/types/dashboard'

interface Props {
  data: StatusDistribution
}

const props = defineProps<Props>()

const option = computed(() => ({
  color: ['#10b981', '#f59e0b', '#94a3b8'],
  tooltip: { trigger: 'item' },
  legend: {
    bottom: 0,
    icon: 'circle'
  },
  series: [
    {
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { name: 'Hoạt động', value: props.data.active },
        { name: 'Bảo trì', value: props.data.maintenance },
        { name: 'Ngưng', value: props.data.inactive }
      ]
    }
  ]
}))
</script>

<template>
  <AppCard>
    <template #title>Trạng thái thiết bị</template>
    <p class="mb-4 text-sm text-slate-500">Phân bổ theo tình trạng vận hành</p>
    <ClientOnly>
      <AppChart chart-class="h-72 w-full" :option="option" />
    </ClientOnly>
  </AppCard>
</template>
