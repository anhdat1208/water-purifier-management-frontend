<script setup lang="ts">
import type { AdminUserStatus } from '~/features/admin/types/admin'

interface Props {
  status: AdminUserStatus
}

defineProps<Props>()

const labelMap: Record<AdminUserStatus, string> = {
  active: 'Hoạt động',
  inactive: 'Ngưng'
}

const toneMap: Record<AdminUserStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="toneMap[status]">
    {{ labelMap[status] }}
  </span>
</template>
