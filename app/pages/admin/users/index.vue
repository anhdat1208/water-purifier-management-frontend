<script setup lang="ts">
import { Plus, Search } from '@lucide/vue'
import { refDebounced } from '@vueuse/core'
import type { AdminUser, AdminUserRole, AdminUserStatus } from '~/features/admin/types/admin'
import type { AdminUserFormValues } from '~/features/admin/schemas/user.schema'
import { useAdminUserList, useAdminUserMutations } from '~/features/admin/composables/useAdmin'

definePageMeta({
  layout: 'app',
  middleware: ['auth', 'admin']
})

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const roleFilter = ref<'all' | AdminUserRole>('all')
const statusFilter = ref<'all' | AdminUserStatus>('all')
const page = ref(1)
const pageSize = 5

const formOpen = ref(false)
const deleteOpen = ref(false)
const editingUser = ref<AdminUser | null>(null)
const deletingUser = ref<AdminUser | null>(null)

const { data, isLoading, isError, refetch, isFetching } = useAdminUserList()
const { createMutation, updateMutation, deleteMutation } = useAdminUserMutations()

const filteredItems = computed(() => {
  const keyword = debouncedSearch.value.trim().toLowerCase()
  return (data.value ?? []).filter((item) => {
    const matchRole = roleFilter.value === 'all' || item.role === roleFilter.value
    const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value
    const matchKeyword =
      !keyword ||
      item.fullName.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword)
    return matchRole && matchStatus && matchKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)))

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

watch([debouncedSearch, roleFilter, statusFilter], () => {
  page.value = 1
})

function openCreate() {
  editingUser.value = null
  formOpen.value = true
}

function openEdit(user: AdminUser) {
  editingUser.value = user
  formOpen.value = true
}

function openDelete(user: AdminUser) {
  deletingUser.value = user
  deleteOpen.value = true
}

async function handleSubmit(values: AdminUserFormValues) {
  if (editingUser.value) {
    await updateMutation.mutateAsync({
      id: editingUser.value.id,
      input: {
        email: values.email,
        fullName: values.fullName,
        role: values.role,
        status: values.status,
        ...(values.password ? { password: values.password } : {})
      }
    })
  } else {
    await createMutation.mutateAsync({
      email: values.email,
      fullName: values.fullName,
      role: values.role,
      status: values.status,
      password: values.password ?? ''
    })
  }
  formOpen.value = false
}

async function confirmDelete() {
  if (!deletingUser.value) return
  await deleteMutation.mutateAsync(deletingUser.value.id)
  deleteOpen.value = false
  deletingUser.value = null
}

const formLoading = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value
)

const deleteDescription = computed(() => {
  if (!deletingUser.value) return 'Bạn có chắc muốn xóa người dùng này?'
  return `Bạn có chắc muốn xóa "${deletingUser.value.fullName}"? Thao tác này không thể hoàn tác.`
})
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Quản lý người dùng</h1>
        <p class="mt-1 text-sm text-slate-500">Thêm, sửa và quản lý tài khoản trong hệ thống.</p>
      </div>
      <AppButton @click="openCreate">
        <Plus class="mr-2 h-4 w-4" />
        Thêm người dùng
      </AppButton>
    </div>

    <AdminSubNav />

    <AppCard class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <AppInput v-model="search" class="pl-9" placeholder="Tìm theo tên, email..." />
        </div>
        <div class="flex gap-3">
          <select
            v-model="roleFilter"
            class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị</option>
            <option value="user">Người dùng</option>
          </select>
          <select
            v-model="statusFilter"
            class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngưng</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="grid gap-3">
        <AppSkeleton v-for="index in 5" :key="index" class="h-14" />
      </div>

      <div v-else-if="isError" class="space-y-4">
        <AppEmpty title="Không tải được danh sách người dùng" description="Vui lòng thử lại sau." />
        <AppButton :loading="isFetching" @click="refetch()">Thử lại</AppButton>
      </div>

      <template v-else>
        <AdminUserTable
          :items="paginatedItems"
          @edit="openEdit"
          @delete="openDelete"
        />

        <AppEmpty
          v-if="filteredItems.length === 0"
          title="Không có người dùng phù hợp"
          description="Thử đổi bộ lọc hoặc thêm người dùng mới."
        />

        <div v-if="filteredItems.length > 0" class="flex justify-end">
          <AppPagination :page="page" :total-pages="totalPages" @change="page = $event" />
        </div>
      </template>
    </AppCard>

    <AdminUserFormModal
      :open="formOpen"
      :user="editingUser"
      :loading="formLoading"
      @close="formOpen = false"
      @submit="handleSubmit"
    />

    <AppConfirmDialog
      :open="deleteOpen"
      title="Xóa người dùng"
      :description="deleteDescription"
      @cancel="deleteOpen = false"
      @confirm="confirmDelete"
    />
  </section>
</template>
