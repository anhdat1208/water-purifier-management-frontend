<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { purifierFormSchema, type PurifierFormValues } from '~/features/purifiers/schemas/purifier.schema'
import type { Purifier } from '~/features/purifiers/types/purifier'

interface Props {
  open: boolean
  purifier?: Purifier | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  purifier: null,
  loading: false
})

const emit = defineEmits<{
  close: []
  submit: [values: PurifierFormValues]
}>()

const isEditMode = computed(() => Boolean(props.purifier))

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(purifierFormSchema)
})

const [name, nameAttrs] = defineField('name')
const [model, modelAttrs] = defineField('model')
const [location, locationAttrs] = defineField('location')
const [installDate, installDateAttrs] = defineField('installDate')
const [status, statusAttrs] = defineField('status')
const [filterLifePercent, filterLifePercentAttrs] = defineField('filterLifePercent')

watch(
  () => [props.open, props.purifier] as const,
  ([open, purifier]) => {
    if (!open) return
    resetForm({
      values: purifier
        ? {
            name: purifier.name,
            model: purifier.model,
            location: purifier.location,
            installDate: purifier.installDate,
            status: purifier.status,
            filterLifePercent: purifier.filterLifePercent
          }
        : {
            name: '',
            model: '',
            location: '',
            installDate: '',
            status: 'active',
            filterLifePercent: 100
          }
    })
  },
  { immediate: true }
)

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <AppModal :open="open" @close="emit('close')">
    <h3 class="text-lg font-semibold text-slate-900">
      {{ isEditMode ? 'Cập nhật máy lọc' : 'Thêm máy lọc mới' }}
    </h3>
    <p class="mt-1 text-sm text-slate-500">
      {{ isEditMode ? 'Chỉnh sửa thông tin thiết bị.' : 'Nhập thông tin thiết bị mới vào hệ thống.' }}
    </p>

    <form class="mt-5 space-y-4" @submit="onSubmit">
      <AuthFormField
        id="purifier-name"
        v-model="name"
        v-bind="nameAttrs"
        label="Tên máy lọc"
        placeholder="Máy lọc phòng khách"
        :error="errors.name"
        :disabled="loading"
      />
      <AuthFormField
        id="purifier-model"
        v-model="model"
        v-bind="modelAttrs"
        label="Model"
        placeholder="RO-500"
        :error="errors.model"
        :disabled="loading"
      />
      <AuthFormField
        id="purifier-location"
        v-model="location"
        v-bind="locationAttrs"
        label="Vị trí"
        placeholder="Phòng khách"
        :error="errors.location"
        :disabled="loading"
      />
      <AuthFormField
        id="purifier-install-date"
        v-model="installDate"
        v-bind="installDateAttrs"
        label="Ngày lắp đặt"
        type="date"
        :error="errors.installDate"
        :disabled="loading"
      />

      <div class="space-y-1.5">
        <label for="purifier-status" class="block text-sm font-medium text-slate-700">Trạng thái</label>
        <select
          id="purifier-status"
          v-model="status"
          v-bind="statusAttrs"
          class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          :disabled="loading"
        >
          <option value="active">Hoạt động</option>
          <option value="maintenance">Bảo trì</option>
          <option value="inactive">Ngưng</option>
        </select>
        <p v-if="errors.status" class="text-xs text-red-500">{{ errors.status }}</p>
      </div>

      <AuthFormField
        id="purifier-filter-life"
        :model-value="String(filterLifePercent ?? '')"
        v-bind="filterLifePercentAttrs"
        label="Tuổi thọ lõi lọc (%)"
        type="number"
        placeholder="100"
        :error="errors.filterLifePercent"
        :disabled="loading"
        @update:model-value="filterLifePercent = Number($event)"
      />

      <div class="flex justify-end gap-2 pt-2">
        <AppButton
          type="button"
          class="bg-slate-200 text-slate-800 hover:bg-slate-300"
          :disabled="loading"
          @click="emit('close')"
        >
          Hủy
        </AppButton>
        <AppButton type="submit" :loading="loading" :disabled="loading">
          {{ isEditMode ? 'Lưu thay đổi' : 'Thêm máy lọc' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
