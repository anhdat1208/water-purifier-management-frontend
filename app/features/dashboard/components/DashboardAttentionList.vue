<script setup lang="ts">
import type { DeviceAttentionItem } from '~/features/dashboard/types/dashboard'

interface Props {
  items: DeviceAttentionItem[]
}

defineProps<Props>()

const statusLabel: Record<DeviceAttentionItem['status'], string> = {
  active: 'Hoạt động',
  maintenance: 'Bảo trì',
  inactive: 'Ngưng'
}

function lifeTone(percent: number) {
  if (percent <= 20) return 'text-red-600 bg-red-50'
  if (percent <= 40) return 'text-amber-600 bg-amber-50'
  return 'text-emerald-600 bg-emerald-50'
}
</script>

<template>
  <AppCard>
    <template #title>Thiết bị cần chú ý</template>
    <AppEmpty
      v-if="items.length === 0"
      title="Không có thiết bị cần xử lý"
      description="Tất cả máy lọc đang hoạt động ổn định."
    />
    <ul v-else class="divide-y divide-slate-100">
      <li v-for="item in items" :key="item.id" class="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
        <div>
          <p class="font-medium text-slate-900">{{ item.name }}</p>
          <p class="mt-0.5 text-sm text-slate-500">{{ item.location }}</p>
          <p class="mt-2 text-sm text-slate-600">{{ item.reason }}</p>
        </div>
        <div class="text-right">
          <span
            class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
            :class="lifeTone(item.filterLifePercent)"
          >
            {{ item.filterLifePercent }}%
          </span>
          <p class="mt-2 text-xs text-slate-500">{{ statusLabel[item.status] }}</p>
        </div>
      </li>
    </ul>
  </AppCard>
</template>
