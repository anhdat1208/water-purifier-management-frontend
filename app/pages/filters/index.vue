<script setup lang="ts">
import { Plus, Search } from '@lucide/vue'
import { refDebounced } from '@vueuse/core'
import { getFilterLifeStatus } from '~/features/filters/constants/filter-labels'
import type { Filter, FilterLifeStatus, FilterType } from '~/features/filters/types/filter'
import {
  toFilterCreateInput,
  type FilterFormValues
} from '~/features/filters/schemas/filter.schema'
import { useFilterList, useFilterMutations } from '~/features/filters/composables/useFilters'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const typeFilter = ref<'all' | FilterType>('all')
const lifeStatusFilter = ref<'all' | FilterLifeStatus>('all')
const purifierFilter = ref('all')
const page = ref(1)
const pageSize = 6

const formOpen = ref(false)
const deleteOpen = ref(false)
const replaceOpen = ref(false)
const editingFilter = ref<Filter | null>(null)
const deletingFilter = ref<Filter | null>(null)
const replacingFilter = ref<Filter | null>(null)

const { data, isLoading, isError, refetch, isFetching } = useFilterList()
const { createMutation, updateMutation, deleteMutation, replaceMutation } = useFilterMutations()

const purifierOptions = computed(() => {
  const items = data.value ?? []
  const map = new Map<string, string>()
  for (const item of items) {
    map.set(item.purifierId, item.purifierName)
  }
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
})

const filteredItems = computed(() => {
  const keyword = debouncedSearch.value.trim().toLowerCase()
  return (data.value ?? []).filter((item) => {
    const matchType = typeFilter.value === 'all' || item.type === typeFilter.value
    const matchLife =
      lifeStatusFilter.value === 'all' || getFilterLifeStatus(item.lifePercent) === lifeStatusFilter.value
    const matchPurifier = purifierFilter.value === 'all' || item.purifierId === purifierFilter.value
    const matchKeyword =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.purifierName.toLowerCase().includes(keyword)
    return matchType && matchLife && matchPurifier && matchKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)))

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

const criticalCount = computed(
  () => (data.value ?? []).filter((f) => getFilterLifeStatus(f.lifePercent) === 'critical').length
)

watch([debouncedSearch, typeFilter, lifeStatusFilter, purifierFilter], () => {
  page.value = 1
})

function openCreate() {
  editingFilter.value = null
  formOpen.value = true
}

function openEdit(filter: Filter) {
  editingFilter.value = filter
  formOpen.value = true
}

function openDelete(filter: Filter) {
  deletingFilter.value = filter
  deleteOpen.value = true
}

function openReplace(filter: Filter) {
  replacingFilter.value = filter
  replaceOpen.value = true
}

async function handleSubmit(values: FilterFormValues) {
  if (editingFilter.value) {
    await updateMutation.mutateAsync({
      id: editingFilter.value.id,
      input: {
        name: values.name,
        type: values.type,
        purifierId: values.purifierId,
        stage: values.stage,
        lifespanDays: values.lifespanDays,
        notes: values.notes
      }
    })
  } else {
    await createMutation.mutateAsync(toFilterCreateInput(values))
  }
  formOpen.value = false
}

async function confirmDelete() {
  if (!deletingFilter.value) return
  await deleteMutation.mutateAsync(deletingFilter.value.id)
  deleteOpen.value = false
  deletingFilter.value = null
}

async function confirmReplace() {
  if (!replacingFilter.value) return
  await replaceMutation.mutateAsync(replacingFilter.value.id)
  replaceOpen.value = false
  replacingFilter.value = null
}

const formLoading = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value
)

const deleteDescription = computed(() => {
  if (!deletingFilter.value) return 'Bạn có chắc muốn xóa lõi lọc này?'
  return `Bạn có chắc muốn xóa "${deletingFilter.value.name}"? Thao tác này không thể hoàn tác.`
})

const replaceDescription = computed(() => {
  if (!replacingFilter.value) return 'Ghi nhận thay lõi lọc?'
  return `Ghi nhận đã thay "${replacingFilter.value.name}"? Tuổi thọ sẽ được đặt lại 100%.`
})
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Lõi lọc</h1>
        <p class="mt-1 text-sm text-slate-500">Quản lý lõi lọc theo từng máy, theo dõi tuổi thọ và lịch thay thế.</p>
      </div>
      <AppButton @click="openCreate">
        <Plus class="mr-2 h-4 w-4" />
        Thêm lõi lọc
      </AppButton>
    </div>

    <div v-if="criticalCount > 0" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      Có {{ criticalCount }} lõi lọc cần thay gấp (tuổi thọ dưới 20%).
    </div>

    <AppCard class="space-y-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <AppInput v-model="search" class="pl-9" placeholder="Tìm theo tên lõi, máy lọc..." />
        </div>
        <div class="flex flex-wrap gap-3">
          <select
            v-model="typeFilter"
            class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          >
            <option value="all">Tất cả loại</option>
            <option value="sediment">Lõi lọc thô</option>
            <option value="carbon">Lõi than hoạt tính</option>
            <option value="ro_membrane">Màng RO</option>
            <option value="mineral">Lõi khoáng</option>
            <option value="post_carbon">Lõi than sau</option>
          </select>
          <select
            v-model="lifeStatusFilter"
            class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="good">Tốt</option>
            <option value="warning">Cần chú ý</option>
            <option value="critical">Cần thay gấp</option>
          </select>
          <select
            v-model="purifierFilter"
            class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          >
            <option value="all">Tất cả máy lọc</option>
            <option v-for="p in purifierOptions" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="grid gap-3">
        <AppSkeleton v-for="index in 6" :key="index" class="h-14" />
      </div>

      <div v-else-if="isError" class="space-y-4">
        <AppEmpty
          title="Không tải được danh sách lõi lọc"
          description="Vui lòng kiểm tra kết nối API hoặc bật chế độ demo."
        />
        <AppButton :loading="isFetching" @click="refetch()">Thử lại</AppButton>
      </div>

      <template v-else>
        <FilterTable
          :items="paginatedItems"
          @edit="openEdit"
          @delete="openDelete"
          @replace="openReplace"
        />

        <AppEmpty
          v-if="filteredItems.length === 0"
          title="Không có lõi lọc phù hợp"
          description="Thử đổi bộ lọc hoặc thêm lõi lọc mới."
        />

        <div v-if="filteredItems.length > 0" class="flex justify-end">
          <AppPagination :page="page" :total-pages="totalPages" @change="page = $event" />
        </div>
      </template>
    </AppCard>

    <FilterFormModal
      :open="formOpen"
      :filter="editingFilter"
      :loading="formLoading"
      @close="formOpen = false"
      @submit="handleSubmit"
    />

    <AppConfirmDialog
      :open="deleteOpen"
      title="Xóa lõi lọc"
      :description="deleteDescription"
      @cancel="deleteOpen = false"
      @confirm="confirmDelete"
    />

    <AppConfirmDialog
      :open="replaceOpen"
      title="Ghi nhận thay lõi"
      :description="replaceDescription"
      @cancel="replaceOpen = false"
      @confirm="confirmReplace"
    />
  </section>
</template>
