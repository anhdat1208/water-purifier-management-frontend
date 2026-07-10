<script setup lang="ts">
import { Pencil, RefreshCw, Trash2 } from '@lucide/vue'
import type { Filter } from '~/features/filters/types/filter'

interface Props {
  items: Filter[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  edit: [filter: Filter]
  delete: [filter: Filter]
  replace: [filter: Filter]
}>()

function formatDate(value: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('vi-VN')
}
</script>

<template>
  <AppTable>
    <thead class="border-b border-slate-200 bg-slate-50 text-slate-600">
      <tr>
        <th class="px-4 py-3 font-medium">Tên lõi lọc</th>
        <th class="px-4 py-3 font-medium">Loại</th>
        <th class="px-4 py-3 font-medium">Máy lọc</th>
        <th class="px-4 py-3 font-medium">Cấp</th>
        <th class="px-4 py-3 font-medium">Tuổi thọ</th>
        <th class="px-4 py-3 font-medium">Trạng thái</th>
        <th class="px-4 py-3 font-medium">Thay gần nhất</th>
        <th class="px-4 py-3 text-right font-medium">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="8" class="px-4 py-8 text-center text-slate-500">Đang tải danh sách...</td>
      </tr>
      <tr v-for="item in items" :key="item.id" class="border-b border-slate-100 last:border-0">
        <td class="px-4 py-4">
          <NuxtLink :to="`/filters/${item.id}`" class="font-medium text-slate-900 hover:text-brand-600">
            {{ item.name }}
          </NuxtLink>
        </td>
        <td class="px-4 py-4">
          <FilterTypeBadge :type="item.type" />
        </td>
        <td class="px-4 py-4 text-slate-600">
          <NuxtLink :to="`/purifiers/${item.purifierId}`" class="hover:text-brand-600">
            {{ item.purifierName }}
          </NuxtLink>
        </td>
        <td class="px-4 py-4 text-slate-600">{{ item.stage }}</td>
        <td class="px-4 py-4 min-w-[140px]">
          <PurifierFilterLifeBar :value="item.lifePercent" />
        </td>
        <td class="px-4 py-4">
          <FilterLifeStatusBadge :life-percent="item.lifePercent" />
        </td>
        <td class="px-4 py-4 text-slate-600">{{ formatDate(item.lastReplacedDate) }}</td>
        <td class="px-4 py-4">
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50"
              title="Ghi nhận thay lõi"
              @click="emit('replace', item)"
            >
              <RefreshCw class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              title="Chỉnh sửa"
              @click="emit('edit', item)"
            >
              <Pencil class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
              title="Xóa"
              @click="emit('delete', item)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </AppTable>
</template>
