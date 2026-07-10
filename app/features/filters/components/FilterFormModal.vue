<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { filterTypeLabels } from '~/features/filters/constants/filter-labels'
import { filterFormSchema, type FilterFormValues } from '~/features/filters/schemas/filter.schema'
import type { Filter } from '~/features/filters/types/filter'
import { usePurifierList } from '~/features/purifiers/composables/usePurifiers'

interface Props {
  open: boolean
  filter?: Filter | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  filter: null,
  loading: false
})

const emit = defineEmits<{
  close: []
  submit: [values: FilterFormValues]
}>()

const isEditMode = computed(() => Boolean(props.filter))
const { data: purifiers } = usePurifierList()

const purifierOptions = computed(() =>
  (purifiers.value ?? []).map((p) => ({ id: p.id, name: p.name }))
)

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(filterFormSchema)
})

const [name, nameAttrs] = defineField('name')
const [type, typeAttrs] = defineField('type')
const [purifierId, purifierIdAttrs] = defineField('purifierId')
const [stage, stageAttrs] = defineField('stage')
const [lifePercent, lifePercentAttrs] = defineField('lifePercent')
const [lifespanDays, lifespanDaysAttrs] = defineField('lifespanDays')
const [installedDate, installedDateAttrs] = defineField('installedDate')
const [lastReplacedDate, lastReplacedDateAttrs] = defineField('lastReplacedDate')
const [notes, notesAttrs] = defineField('notes')

watch(
  () => [props.open, props.filter] as const,
  ([open, filter]) => {
    if (!open) return
    resetForm({
      values: filter
        ? {
            name: filter.name,
            type: filter.type,
            purifierId: filter.purifierId,
            stage: filter.stage,
            lifePercent: filter.lifePercent,
            lifespanDays: filter.lifespanDays,
            installedDate: filter.installedDate,
            lastReplacedDate: filter.lastReplacedDate,
            notes: filter.notes ?? ''
          }
        : {
            name: '',
            type: 'sediment',
            purifierId: '',
            stage: 1,
            lifePercent: 100,
            lifespanDays: 180,
            installedDate: '',
            lastReplacedDate: '',
            notes: ''
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
      {{ isEditMode ? 'Cập nhật lõi lọc' : 'Thêm lõi lọc mới' }}
    </h3>
    <p class="mt-1 text-sm text-slate-500">
      {{ isEditMode ? 'Chỉnh sửa thông tin lõi lọc.' : 'Nhập thông tin lõi lọc mới vào hệ thống.' }}
    </p>

    <form class="mt-5 space-y-4" @submit="onSubmit">
      <AuthFormField
        id="filter-name"
        v-model="name"
        v-bind="nameAttrs"
        label="Tên lõi lọc"
        placeholder="Lõi PP 5 micron"
        :error="errors.name"
        :disabled="loading"
      />

      <div class="space-y-1.5">
        <label for="filter-type" class="block text-sm font-medium text-slate-700">Loại lõi lọc</label>
        <select
          id="filter-type"
          v-model="type"
          v-bind="typeAttrs"
          class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          :disabled="loading"
        >
          <option v-for="(label, key) in filterTypeLabels" :key="key" :value="key">
            {{ label }}
          </option>
        </select>
        <p v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</p>
      </div>

      <div class="space-y-1.5">
        <label for="filter-purifier" class="block text-sm font-medium text-slate-700">Máy lọc</label>
        <select
          id="filter-purifier"
          v-model="purifierId"
          v-bind="purifierIdAttrs"
          class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          :disabled="loading"
        >
          <option value="">-- Chọn máy lọc --</option>
          <option v-for="p in purifierOptions" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
        <p v-if="errors.purifierId" class="text-xs text-red-500">{{ errors.purifierId }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <AuthFormField
          id="filter-stage"
          :model-value="String(stage ?? '')"
          v-bind="stageAttrs"
          label="Cấp lọc"
          type="number"
          placeholder="1"
          :error="errors.stage"
          :disabled="loading"
          @update:model-value="stage = Number($event)"
        />
        <AuthFormField
          id="filter-lifespan"
          :model-value="String(lifespanDays ?? '')"
          v-bind="lifespanDaysAttrs"
          label="Tuổi thọ (ngày)"
          type="number"
          placeholder="180"
          :error="errors.lifespanDays"
          :disabled="loading"
          @update:model-value="lifespanDays = Number($event)"
        />
      </div>

      <AuthFormField
        id="filter-life-percent"
        :model-value="String(lifePercent ?? '')"
        v-bind="lifePercentAttrs"
        label="Tuổi thọ còn lại (%)"
        type="number"
        placeholder="100"
        :error="errors.lifePercent"
        :disabled="loading"
        @update:model-value="lifePercent = Number($event)"
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <AuthFormField
          id="filter-installed-date"
          v-model="installedDate"
          v-bind="installedDateAttrs"
          label="Ngày lắp đặt"
          type="date"
          :error="errors.installedDate"
          :disabled="loading"
        />
        <AuthFormField
          id="filter-last-replaced"
          v-model="lastReplacedDate"
          v-bind="lastReplacedDateAttrs"
          label="Ngày thay gần nhất"
          type="date"
          :error="errors.lastReplacedDate"
          :disabled="loading"
        />
      </div>

      <AuthFormField
        id="filter-notes"
        v-model="notes"
        v-bind="notesAttrs"
        label="Ghi chú (tuỳ chọn)"
        placeholder="Ghi chú thêm..."
        :error="errors.notes"
        :disabled="loading"
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
          {{ isEditMode ? 'Lưu thay đổi' : 'Thêm lõi lọc' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
