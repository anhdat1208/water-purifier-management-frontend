<script setup lang="ts">
import { filterLifeStatusLabels, getFilterLifeStatus } from '~/features/filters/constants/filter-labels'

interface Props {
  lifePercent: number
}

const props = defineProps<Props>()

const status = computed(() => getFilterLifeStatus(props.lifePercent))

const toneMap = {
  good: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  critical: 'bg-red-50 text-red-700'
} as const
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="toneMap[status]">
    {{ filterLifeStatusLabels[status] }}
  </span>
</template>
