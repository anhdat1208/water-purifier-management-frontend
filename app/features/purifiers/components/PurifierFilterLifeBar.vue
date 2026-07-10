<script setup lang="ts">
interface Props {
  value: number
}

const props = defineProps<Props>()

const tone = computed(() => {
  if (props.value <= 20) return 'bg-red-500'
  if (props.value <= 40) return 'bg-amber-500'
  return 'bg-emerald-500'
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
      <div class="h-full rounded-full transition-all" :class="tone" :style="{ width: `${value}%` }" />
    </div>
    <span class="w-10 text-right text-xs font-medium text-slate-600">{{ value }}%</span>
  </div>
</template>
