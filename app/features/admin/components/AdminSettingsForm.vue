<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { systemSettingsSchema, type SystemSettingsFormValues } from '~/features/admin/schemas/settings.schema'
import type { SystemSettings } from '~/features/admin/types/admin'

interface Props {
  settings?: SystemSettings | null
  loading?: boolean
  saving?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  settings: null,
  loading: false,
  saving: false
})

const emit = defineEmits<{
  submit: [values: SystemSettingsFormValues]
}>()

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(systemSettingsSchema)
})

const [siteName, siteNameAttrs] = defineField('siteName')
const [maintenanceMode, maintenanceModeAttrs] = defineField('maintenanceMode')
const [filterWarningThreshold, filterWarningThresholdAttrs] = defineField('filterWarningThreshold')
const [filterCriticalThreshold, filterCriticalThresholdAttrs] = defineField('filterCriticalThreshold')
const [notificationEmail, notificationEmailAttrs] = defineField('notificationEmail')
const [autoNotifyFilterDue, autoNotifyFilterDueAttrs] = defineField('autoNotifyFilterDue')

watch(
  () => props.settings,
  (settings) => {
    if (!settings) return
    resetForm({ values: { ...settings } })
  },
  { immediate: true }
)

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <div v-if="loading" class="space-y-4">
    <AppSkeleton class="h-11" />
    <AppSkeleton class="h-11" />
    <AppSkeleton class="h-24" />
  </div>

  <form v-else class="space-y-5" @submit="onSubmit">
    <AuthFormField
      id="settings-site-name"
      v-model="siteName"
      v-bind="siteNameAttrs"
      label="Tên hệ thống"
      placeholder="Water Purifier Management"
      :error="errors.siteName"
      :disabled="saving"
    />

    <AuthFormField
      id="settings-notification-email"
      v-model="notificationEmail"
      v-bind="notificationEmailAttrs"
      label="Email nhận thông báo"
      type="email"
      placeholder="alerts@example.com"
      :error="errors.notificationEmail"
      :disabled="saving"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <AuthFormField
        id="settings-warning-threshold"
        :model-value="String(filterWarningThreshold ?? '')"
        v-bind="filterWarningThresholdAttrs"
        label="Ngưỡng cảnh báo lõi lọc (%)"
        type="number"
        placeholder="40"
        :error="errors.filterWarningThreshold"
        :disabled="saving"
        @update:model-value="filterWarningThreshold = Number($event)"
      />
      <AuthFormField
        id="settings-critical-threshold"
        :model-value="String(filterCriticalThreshold ?? '')"
        v-bind="filterCriticalThresholdAttrs"
        label="Ngưỡng nguy hiểm lõi lọc (%)"
        type="number"
        placeholder="20"
        :error="errors.filterCriticalThreshold"
        :disabled="saving"
        @update:model-value="filterCriticalThreshold = Number($event)"
      />
    </div>

    <div class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <label class="flex cursor-pointer items-center gap-3">
        <input
          v-model="maintenanceMode"
          v-bind="maintenanceModeAttrs"
          type="checkbox"
          class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          :disabled="saving"
        />
        <div>
          <p class="text-sm font-medium text-slate-900">Chế độ bảo trì</p>
          <p class="text-xs text-slate-500">Tạm ngưng truy cập hệ thống cho người dùng thường.</p>
        </div>
      </label>

      <label class="flex cursor-pointer items-center gap-3">
        <input
          v-model="autoNotifyFilterDue"
          v-bind="autoNotifyFilterDueAttrs"
          type="checkbox"
          class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          :disabled="saving"
        />
        <div>
          <p class="text-sm font-medium text-slate-900">Tự động thông báo lõi sắp hết hạn</p>
          <p class="text-xs text-slate-500">Gửi email khi lõi lọc dưới ngưỡng cảnh báo.</p>
        </div>
      </label>
    </div>

    <div class="flex justify-end">
      <AppButton type="submit" :loading="saving" :disabled="saving">
        Lưu cài đặt
      </AppButton>
    </div>
  </form>
</template>
