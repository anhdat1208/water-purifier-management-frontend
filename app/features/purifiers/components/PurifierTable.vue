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
  <div>
    <p v-if="loading" class="py-8 text-center text-sm text-slate-500">Đang tải danh sách...</p>

    <template v-else>
      <!-- Mobile: card list -->
      <ul class="space-y-3 md:hidden">
        <li
          v-for="item in items"
          :key="item.id"
          class="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <NuxtLink
                :to="`/purifiers/${item.id}`"
                class="block truncate font-medium text-slate-900 hover:text-brand-600"
              >
                {{ item.name }}
              </NuxtLink>
              <p class="mt-1 truncate text-sm text-slate-500">{{ item.model }} · {{ item.location }}</p>
            </div>
            <PurifierStatusBadge :status="item.status as PurifierStatus" />
          </div>

          <div class="mt-3">
            <p class="mb-1 text-xs text-slate-500">Lõi lọc</p>
            <PurifierFilterLifeBar :value="item.filterLifePercent" />
          </div>

          <div class="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <p class="text-xs text-slate-500">Lắp: {{ formatDate(item.installDate) }}</p>
            <div class="flex gap-2">
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
          </div>
        </li>
      </ul>

      <!-- Desktop: table -->
      <div class="hidden md:block">
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
      </div>
    </template>
  </div>
</template>
