<script setup lang="ts">
import type { AdminUserRole } from '~/features/admin/types/admin'

interface Props {
  role: AdminUserRole
}

defineProps<Props>()

const labelMap: Record<AdminUserRole, string> = {
  admin: 'Quản trị',
  user: 'Người dùng'
}

const toneMap: Record<AdminUserRole, string> = {
  admin: 'bg-violet-50 text-violet-700',
  user: 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="toneMap[role]">
    {{ labelMap[role] }}
  </span>
</template>
