<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue'
import type { AdminUser } from '~/features/admin/types/admin'

interface Props {
  items: AdminUser[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  edit: [user: AdminUser]
  delete: [user: AdminUser]
}>()

function formatDate(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <AppTable>
    <thead class="border-b border-slate-200 bg-slate-50 text-slate-600">
      <tr>
        <th class="px-4 py-3 font-medium">Họ tên</th>
        <th class="px-4 py-3 font-medium">Email</th>
        <th class="px-4 py-3 font-medium">Vai trò</th>
        <th class="px-4 py-3 font-medium">Trạng thái</th>
        <th class="px-4 py-3 font-medium">Đăng nhập gần nhất</th>
        <th class="px-4 py-3 text-right font-medium">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="6" class="px-4 py-8 text-center text-slate-500">Đang tải danh sách...</td>
      </tr>
      <tr v-for="item in items" :key="item.id" class="border-b border-slate-100 last:border-0">
        <td class="px-4 py-4 font-medium text-slate-900">{{ item.fullName }}</td>
        <td class="px-4 py-4 text-slate-600">{{ item.email }}</td>
        <td class="px-4 py-4">
          <AdminRoleBadge :role="item.role" />
        </td>
        <td class="px-4 py-4">
          <AdminStatusBadge :status="item.status" />
        </td>
        <td class="px-4 py-4 text-slate-600">{{ formatDate(item.lastLoginAt) }}</td>
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
