<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  option: Record<string, unknown>
  chartClass?: string
}

const props = defineProps<Props>()

const VChart = shallowRef<Component | null>(null)
const loadError = ref(false)

onMounted(async () => {
  try {
    const [{ use }, charts, components, { CanvasRenderer }, vueEcharts] = await Promise.all([
      import('echarts/core'),
      import('echarts/charts'),
      import('echarts/components'),
      import('echarts/renderers'),
      import('vue-echarts')
    ])

    use([
      CanvasRenderer,
      charts.LineChart,
      charts.BarChart,
      charts.PieChart,
      components.GridComponent,
      components.TooltipComponent,
      components.LegendComponent
    ])

    VChart.value = vueEcharts.default
  } catch {
    loadError.value = true
  }
})
</script>

<template>
  <AppSkeleton v-if="!VChart && !loadError" class="h-72 w-full" />
  <AppEmpty
    v-else-if="loadError"
    title="Không tải được biểu đồ"
    description="Vui lòng tải lại trang."
    class="h-72"
  />
  <component
    :is="VChart"
    v-else
    :option="option"
    autoresize
    :class="props.chartClass"
  />
</template>
