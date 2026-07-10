<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue'
import type { Purifier, PurifierStatus } from '~/features/purifiers/types/purifier'

interface Props {
  items: Purifier[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  edit: [purifier: Purifier]
  delete: [purifier: Purifier]
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
        <th class="px-4 py-3 font-medium">Tên máy lọc</th>
        <th class="px-4 py-3 font-medium">Model</th>
        <th class="px-4 py-3 font-medium">Vị trí</th>
        <th class="px-4 py-3 font-medium">Ngày lắp</th>
        <th class="px-4 py-3 font-medium">Trạng thái</th>
        <th class="px-4 py-3 font-medium">Lõi lọc</th>
        <th class="px-4 py-3 text-right font-medium">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="7" class="px-4 py-8 text-center text-slate-500">Đang tải danh sách...</td>
      </tr>
      <tr v-for="item in items" :key="item.id" class="border-b border-slate-100 last:border-0">
        <td class="px-4 py-4">
          <NuxtLink :to="`/purifiers/${item.id}`" class="font-medium text-slate-900 hover:text-brand-600">
            {{ item.name }}
          </NuxtLink>
        </td>
        <td class="px-4 py-4 text-slate-600">{{ item.model }}</td>
        <td class="px-4 py-4 text-slate-600">{{ item.location }}</td>
        <td class="px-4 py-4 text-slate-600">{{ formatDate(item.installDate) }}</td>
        <td class="px-4 py-4">
          <PurifierStatusBadge :status="item.status as PurifierStatus" />
        </td>
        <td class="px-4 py-4 min-w-[140px]">
          <PurifierFilterLifeBar :value="item.filterLifePercent" />
        </td>
        <td class="px-4 py-4">
          <div class="flex justify-end gap-2">
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
