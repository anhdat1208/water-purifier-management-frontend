<script setup lang="ts">
import { Plus, Search } from '@lucide/vue'
import { refDebounced } from '@vueuse/core'
import type { Purifier, PurifierStatus } from '~/features/purifiers/types/purifier'
import {
  toPurifierCreateInput,
  type PurifierFormValues
} from '~/features/purifiers/schemas/purifier.schema'
import { usePurifierList, usePurifierMutations } from '~/features/purifiers/composables/usePurifiers'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const statusFilter = ref<'all' | PurifierStatus>('all')
const page = ref(1)
const pageSize = 5

const formOpen = ref(false)
const deleteOpen = ref(false)
const editingPurifier = ref<Purifier | null>(null)
const deletingPurifier = ref<Purifier | null>(null)

const { data, isLoading, isError, refetch, isFetching } = usePurifierList()
const { createMutation, updateMutation, deleteMutation } = usePurifierMutations()

const filteredItems = computed(() => {
  const keyword = debouncedSearch.value.trim().toLowerCase()
  return (data.value ?? []).filter((item) => {
    const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value
    const matchKeyword =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.model.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword)
    return matchStatus && matchKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)))

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

watch([debouncedSearch, statusFilter], () => {
  page.value = 1
})

function openCreate() {
  editingPurifier.value = null
  formOpen.value = true
}

function openEdit(purifier: Purifier) {
  editingPurifier.value = purifier
  formOpen.value = true
}

function openDelete(purifier: Purifier) {
  deletingPurifier.value = purifier
  deleteOpen.value = true
}

async function handleSubmit(values: PurifierFormValues) {
  if (editingPurifier.value) {
    await updateMutation.mutateAsync({
      id: editingPurifier.value.id,
      input: { name: values.name, model: values.model }
    })
  } else {
    await createMutation.mutateAsync(toPurifierCreateInput(values))
  }
  formOpen.value = false
}

async function confirmDelete() {
  if (!deletingPurifier.value) return
  await deleteMutation.mutateAsync(deletingPurifier.value.id)
  deleteOpen.value = false
  deletingPurifier.value = null
}

const formLoading = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value
)

const deleteDescription = computed(() => {
  if (!deletingPurifier.value) return 'Bạn có chắc muốn xóa máy lọc này?'
  return `Bạn có chắc muốn xóa "${deletingPurifier.value.name}"? Thao tác này không thể hoàn tác.`
})
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Máy lọc nước</h1>
        <p class="mt-1 text-sm text-slate-500">Quản lý danh sách thiết bị, trạng thái và tuổi thọ lõi lọc.</p>
      </div>
      <AppButton class="w-full sm:w-auto" @click="openCreate">
        <Plus class="mr-2 h-4 w-4" />
        Thêm máy lọc
      </AppButton>
    </div>

    <AppCard class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <AppInput v-model="search" class="pl-9" placeholder="Tìm theo tên, model, vị trí..." />
        </div>
        <select
          v-model="statusFilter"
          class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 sm:w-auto"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="maintenance">Bảo trì</option>
          <option value="inactive">Ngưng</option>
        </select>
      </div>

      <div v-if="isLoading" class="grid gap-3">
        <AppSkeleton v-for="index in 5" :key="index" class="h-14" />
      </div>

      <div v-else-if="isError" class="space-y-4">
        <AppEmpty
          title="Không tải được danh sách máy lọc"
          description="Vui lòng kiểm tra kết nối API hoặc bật chế độ demo."
        />
        <AppButton :loading="isFetching" @click="refetch()">Thử lại</AppButton>
      </div>

      <template v-else>
        <PurifierTable
          :items="paginatedItems"
          @edit="openEdit"
          @delete="openDelete"
        />

        <AppEmpty
          v-if="filteredItems.length === 0"
          title="Không có máy lọc phù hợp"
          description="Thử đổi bộ lọc hoặc thêm thiết bị mới."
        />

        <div v-if="filteredItems.length > 0" class="flex justify-end">
          <AppPagination :page="page" :total-pages="totalPages" @change="page = $event" />
        </div>
      </template>
    </AppCard>

    <PurifierFormModal
      :open="formOpen"
      :purifier="editingPurifier"
      :loading="formLoading"
      @close="formOpen = false"
      @submit="handleSubmit"
    />

    <AppConfirmDialog
      :open="deleteOpen"
      title="Xóa máy lọc"
      :description="deleteDescription"
      @cancel="deleteOpen = false"
      @confirm="confirmDelete"
    />
  </section>
</template>
