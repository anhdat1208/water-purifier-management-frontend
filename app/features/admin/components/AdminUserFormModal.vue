<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import {
  adminUserCreateSchema,
  adminUserFormSchema,
  type AdminUserFormValues
} from '~/features/admin/schemas/user.schema'
import type { AdminUser } from '~/features/admin/types/admin'

interface Props {
  open: boolean
  user?: AdminUser | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  loading: false
})

const emit = defineEmits<{
  close: []
  submit: [values: AdminUserFormValues]
}>()

const isEditMode = computed(() => Boolean(props.user))

const validationSchema = computed(() =>
  toTypedSchema(isEditMode.value ? adminUserFormSchema : adminUserCreateSchema)
)

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema
})

const [email, emailAttrs] = defineField('email')
const [fullName, fullNameAttrs] = defineField('fullName')
const [role, roleAttrs] = defineField('role')
const [status, statusAttrs] = defineField('status')
const [password, passwordAttrs] = defineField('password')

watch(
  () => [props.open, props.user] as const,
  ([open, user]) => {
    if (!open) return
    resetForm({
      values: user
        ? {
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
            password: ''
          }
        : {
            email: '',
            fullName: '',
            role: 'user',
            status: 'active',
            password: ''
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
      {{ isEditMode ? 'Cập nhật người dùng' : 'Thêm người dùng mới' }}
    </h3>
    <p class="mt-1 text-sm text-slate-500">
      {{ isEditMode ? 'Chỉnh sửa thông tin tài khoản.' : 'Tạo tài khoản mới trong hệ thống.' }}
    </p>

    <form class="mt-5 space-y-4" @submit="onSubmit">
      <AuthFormField
        id="admin-user-name"
        v-model="fullName"
        v-bind="fullNameAttrs"
        label="Họ tên"
        placeholder="Nguyễn Văn A"
        :error="errors.fullName"
        :disabled="loading"
      />
      <AuthFormField
        id="admin-user-email"
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        type="email"
        placeholder="user@example.com"
        :error="errors.email"
        :disabled="loading"
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-1.5">
          <label for="admin-user-role" class="block text-sm font-medium text-slate-700">Vai trò</label>
          <select
            id="admin-user-role"
            v-model="role"
            v-bind="roleAttrs"
            class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            :disabled="loading"
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị</option>
          </select>
          <p v-if="errors.role" class="text-xs text-red-500">{{ errors.role }}</p>
        </div>
        <div class="space-y-1.5">
          <label for="admin-user-status" class="block text-sm font-medium text-slate-700">Trạng thái</label>
          <select
            id="admin-user-status"
            v-model="status"
            v-bind="statusAttrs"
            class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            :disabled="loading"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngưng</option>
          </select>
          <p v-if="errors.status" class="text-xs text-red-500">{{ errors.status }}</p>
        </div>
      </div>

      <AuthFormField
        id="admin-user-password"
        v-model="password"
        v-bind="passwordAttrs"
        :label="isEditMode ? 'Mật khẩu mới (tuỳ chọn)' : 'Mật khẩu'"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
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
          {{ isEditMode ? 'Lưu thay đổi' : 'Thêm người dùng' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
