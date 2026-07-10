<script setup lang="ts">
import type { PurifierStatus } from '~/features/purifiers/types/purifier'

interface Props {
  status: PurifierStatus
}

defineProps<Props>()

const labelMap: Record<PurifierStatus, string> = {
  active: 'Hoạt động',
  maintenance: 'Bảo trì',
  inactive: 'Ngưng'
}

const toneMap: Record<PurifierStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  maintenance: 'bg-amber-50 text-amber-700',
  inactive: 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="toneMap[status]">
    {{ labelMap[status] }}
  </span>
</template>
