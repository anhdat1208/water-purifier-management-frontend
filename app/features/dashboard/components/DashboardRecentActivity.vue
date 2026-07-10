<script setup lang="ts">
import type { ActivityType, RecentActivityItem } from '~/features/dashboard/types/dashboard'

interface Props {
  items: RecentActivityItem[]
}

defineProps<Props>()

const typeLabel: Record<ActivityType, string> = {
  filter: 'Lõi lọc',
  maintenance: 'Bảo trì',
  alert: 'Cảnh báo',
  system: 'Hệ thống'
}

const typeTone: Record<ActivityType, string> = {
  filter: 'bg-blue-50 text-blue-700',
  maintenance: 'bg-emerald-50 text-emerald-700',
  alert: 'bg-amber-50 text-amber-700',
  system: 'bg-slate-100 text-slate-700'
}

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  })
}
</script>

<template>
  <AppCard>
    <template #title>Hoạt động gần đây</template>
    <AppEmpty
      v-if="items.length === 0"
      title="Chưa có hoạt động"
      description="Các sự kiện hệ thống sẽ hiển thị tại đây."
    />
    <ul v-else class="space-y-4">
      <li v-for="item in items" :key="item.id" class="rounded-xl border border-slate-100 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-medium text-slate-900">{{ item.title }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ item.description }}</p>
          </div>
          <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" :class="typeTone[item.type]">
            {{ typeLabel[item.type] }}
          </span>
        </div>
        <p class="mt-3 text-xs text-slate-400">{{ formatTime(item.createdAt) }}</p>
      </li>
    </ul>
  </AppCard>
</template>
