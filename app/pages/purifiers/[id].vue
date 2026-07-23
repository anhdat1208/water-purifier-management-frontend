<script setup lang="ts">
import { ArrowLeft, Pencil } from '@lucide/vue'
import type { PurifierFormValues } from '~/features/purifiers/schemas/purifier.schema'
import { usePurifierDetail, usePurifierMutations } from '~/features/purifiers/composables/usePurifiers'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const route = useRoute()
const purifierId = computed(() => String(route.params.id))

const { data: purifier, isLoading, isError, refetch } = usePurifierDetail(purifierId)
const { updateMutation } = usePurifierMutations()

const formOpen = ref(false)

function formatDate(value: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('vi-VN')
}

async function handleSubmit(values: PurifierFormValues) {
  await updateMutation.mutateAsync({
    id: purifierId.value,
    input: { name: values.name, model: values.model }
  })
  formOpen.value = false
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/purifiers"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        <ArrowLeft class="h-4 w-4" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Chi tiết máy lọc</h1>
        <p class="mt-1 text-sm text-slate-500">Thông tin vận hành và trạng thái thiết bị.</p>
      </div>
    </div>

    <div v-if="isLoading" class="grid gap-4 md:grid-cols-2">
      <AppSkeleton class="h-48" />
      <AppSkeleton class="h-48" />
    </div>

    <div v-else-if="isError || !purifier" class="space-y-4">
      <AppEmpty title="Không tìm thấy máy lọc" description="Thiết bị có thể đã bị xóa hoặc không tồn tại." />
      <AppButton @click="refetch()">Thử lại</AppButton>
    </div>

    <template v-else>
      <div class="flex justify-end">
        <AppButton @click="formOpen = true">
          <Pencil class="mr-2 h-4 w-4" />
          Chỉnh sửa
        </AppButton>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <AppCard>
          <template #title>{{ purifier.name }}</template>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Model</dt>
              <dd class="font-medium text-slate-900">{{ purifier.model }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Vị trí</dt>
              <dd class="font-medium text-slate-900">{{ purifier.location }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-slate-500">Ngày lắp đặt</dt>
              <dd class="font-medium text-slate-900">{{ formatDate(purifier.installDate) }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="text-slate-500">Trạng thái</dt>
              <dd><PurifierStatusBadge :status="purifier.status" /></dd>
            </div>
          </dl>
        </AppCard>

        <AppCard>
          <template #title>Tuổi thọ lõi lọc</template>
          <p class="mb-4 text-sm text-slate-500">Theo dõi mức còn lại của lõi lọc hiện tại.</p>
          <PurifierFilterLifeBar :value="purifier.filterLifePercent" />
          <p v-if="purifier.filterLifePercent <= 20" class="mt-4 text-sm text-red-600">
            Cần thay lõi lọc sớm để đảm bảo chất lượng nước.
          </p>
        </AppCard>
      </div>

      <PurifierFormModal
        :open="formOpen"
        :purifier="purifier"
        :loading="updateMutation.isPending.value"
        @close="formOpen = false"
        @submit="handleSubmit"
      />
    </template>
  </section>
</template>
