<script setup lang="ts">
import { ArrowLeft, Pencil, RefreshCw } from '@lucide/vue'
import { filterTypeLabels } from '~/features/filters/constants/filter-labels'
import type { FilterFormValues } from '~/features/filters/schemas/filter.schema'
import { useFilterDetail, useFilterMutations } from '~/features/filters/composables/useFilters'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const route = useRoute()
const filterId = computed(() => String(route.params.id))

const { data: filter, isLoading, isError, refetch } = useFilterDetail(filterId)
const { updateMutation, replaceMutation } = useFilterMutations()

const formOpen = ref(false)
const replaceOpen = ref(false)

function formatDate(value: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('vi-VN')
}

async function handleSubmit(values: FilterFormValues) {
  await updateMutation.mutateAsync({
    id: filterId.value,
    input: values
  })
  formOpen.value = false
}

async function confirmReplace() {
  await replaceMutation.mutateAsync(filterId.value)
  replaceOpen.value = false
}

const replaceDescription = computed(() => {
  if (!filter.value) return 'Ghi nhận thay lõi lọc?'
  return `Ghi nhận đã thay "${filter.value.name}"? Tuổi thọ sẽ được đặt lại 100%.`
})
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/filters"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        <ArrowLeft class="h-4 w-4" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Chi tiết lõi lọc</h1>
        <p class="mt-1 text-sm text-slate-500">Thông tin tuổi thọ và lịch thay thế lõi lọc.</p>
      </div>
    </div>

    <div v-if="isLoading" class="grid gap-4 md:grid-cols-2">
      <AppSkeleton class="h-48" />
      <AppSkeleton class="h-48" />
    </div>

    <div v-else-if="isError || !filter" class="space-y-4">
      <AppEmpty title="Không tìm thấy lõi lọc" description="Lõi lọc có thể đã bị xóa hoặc không tồn tại." />
      <AppButton @click="refetch()">Thử lại</AppButton>
    </div>

    <template v-else>
      <div class="flex flex-wrap justify-end gap-2">
        <AppButton
          class="bg-emerald-600 hover:bg-emerald-700"
          :loading="replaceMutation.isPending.value"
          @click="replaceOpen = true"
        >
          <RefreshCw class="mr-2 h-4 w-4" />
          Ghi nhận thay lõi
        </AppButton>
        <AppButton @click="formOpen = true">
          <Pencil class="mr-2 h-4 w-4" />
          Chỉnh sửa
        </AppButton>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <AppCard>
          <template #title>{{ filter.name }}</template>
          <dl class="space-y-3 text-sm">
            <div class="flex items-center justify-between gap-4">
              <dt class="text-slate-500">Loại lõi</dt>
              <dd><FilterTypeBadge :type="filter.type" /></dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Máy lọc</dt>
              <dd>
                <NuxtLink :to="`/purifiers/${filter.purifierId}`" class="font-medium text-brand-600 hover:underline">
                  {{ filter.purifierName }}
                </NuxtLink>
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Cấp lọc</dt>
              <dd class="font-medium text-slate-900">Cấp {{ filter.stage }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Tuổi thọ thiết kế</dt>
              <dd class="font-medium text-slate-900">{{ filter.lifespanDays }} ngày</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Ngày lắp đặt</dt>
              <dd class="font-medium text-slate-900">{{ formatDate(filter.installedDate) }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Thay gần nhất</dt>
              <dd class="font-medium text-slate-900">{{ formatDate(filter.lastReplacedDate) }}</dd>
            </div>
            <div v-if="filter.notes" class="flex justify-between gap-4">
              <dt class="text-slate-500">Ghi chú</dt>
              <dd class="max-w-[60%] text-right font-medium text-slate-900">{{ filter.notes }}</dd>
            </div>
          </dl>
        </AppCard>

        <AppCard>
          <template #title>Tuổi thọ còn lại</template>
          <div class="mb-4 flex items-center justify-between">
            <p class="text-sm text-slate-500">Theo dõi mức còn lại của lõi lọc.</p>
            <FilterLifeStatusBadge :life-percent="filter.lifePercent" />
          </div>
          <PurifierFilterLifeBar :value="filter.lifePercent" />
          <p class="mt-2 text-center text-2xl font-semibold text-slate-900">{{ filter.lifePercent }}%</p>
          <p v-if="filter.lifePercent <= 20" class="mt-4 text-sm text-red-600">
            Cần thay lõi lọc sớm để đảm bảo chất lượng nước.
          </p>
          <p v-else-if="filter.lifePercent <= 40" class="mt-4 text-sm text-amber-600">
            Nên chuẩn bị thay lõi lọc trong thời gian tới.
          </p>
          <p v-else class="mt-4 text-sm text-emerald-600">
            Lõi lọc đang hoạt động tốt.
          </p>
        </AppCard>
      </div>

      <AppCard>
        <template #title>Thông tin loại lõi</template>
        <p class="text-sm text-slate-600">
          {{ filterTypeLabels[filter.type] }} — cấp {{ filter.stage }} trong hệ thống lọc của
          <strong>{{ filter.purifierName }}</strong>.
        </p>
      </AppCard>

      <FilterFormModal
        :open="formOpen"
        :filter="filter"
        :loading="updateMutation.isPending.value"
        @close="formOpen = false"
        @submit="handleSubmit"
      />

      <AppConfirmDialog
        :open="replaceOpen"
        title="Ghi nhận thay lõi"
        :description="replaceDescription"
        @cancel="replaceOpen = false"
        @confirm="confirmReplace"
      />
    </template>
  </section>
</template>
