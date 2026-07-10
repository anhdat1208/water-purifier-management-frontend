<script setup lang="ts">
import { filterTypeLabels } from '~/features/filters/constants/filter-labels'
import type { FilterType } from '~/features/filters/types/filter'

interface Props {
  type: FilterType
}

defineProps<Props>()

const toneMap: Record<FilterType, string> = {
  sediment: 'bg-blue-50 text-blue-700',
  carbon: 'bg-violet-50 text-violet-700',
  ro_membrane: 'bg-cyan-50 text-cyan-700',
  mineral: 'bg-teal-50 text-teal-700',
  post_carbon: 'bg-indigo-50 text-indigo-700'
}
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="toneMap[type]">
    {{ filterTypeLabels[type] }}
  </span>
</template>
