<script setup lang="ts">
import type { SystemHealthStatus } from '~/features/admin/types/admin'

interface Props {
  status: SystemHealthStatus
}

defineProps<Props>()

const labelMap: Record<SystemHealthStatus, string> = {
  healthy: 'Ổn định',
  warning: 'Cảnh báo',
  critical: 'Nguy hiểm'
}

const toneMap: Record<SystemHealthStatus, string> = {
  healthy: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  critical: 'bg-red-50 text-red-700'
}
</script>

<template>
  <span class="inline-flex rounded-full px-3 py-1 text-sm font-medium" :class="toneMap[status]">
    {{ labelMap[status] }}
  </span>
</template>
