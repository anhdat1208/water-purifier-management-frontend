<script setup lang="ts">
import type { SystemSettingsFormValues } from '~/features/admin/schemas/settings.schema'
import { useAdminSettings } from '~/features/admin/composables/useAdmin'

definePageMeta({
  layout: 'app',
  middleware: ['auth', 'admin']
})

const { settingsQuery, updateMutation } = useAdminSettings()

async function handleSubmit(values: SystemSettingsFormValues) {
  await updateMutation.mutateAsync(values)
}
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Cài đặt hệ thống</h1>
      <p class="mt-1 text-sm text-slate-500">Cấu hình thông báo, ngưỡng cảnh báo và chế độ bảo trì.</p>
    </div>

    <AdminSubNav />

    <AppCard>
      <template #title>Thiết lập chung</template>
      <p class="mb-5 text-sm text-slate-500">
        Các thay đổi sẽ áp dụng cho toàn bộ hệ thống sau khi lưu.
      </p>

      <div v-if="settingsQuery.isError.value" class="space-y-4">
        <AppEmpty title="Không tải được cài đặt" description="Vui lòng thử lại sau." />
        <AppButton @click="settingsQuery.refetch()">Thử lại</AppButton>
      </div>

      <AdminSettingsForm
        v-else
        :settings="settingsQuery.data.value"
        :loading="settingsQuery.isLoading.value"
        :saving="updateMutation.isPending.value"
        @submit="handleSubmit"
      />
    </AppCard>
  </section>
</template>
