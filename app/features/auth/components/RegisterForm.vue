<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { registerSchema } from '~/features/auth/schemas/register.schema'
import { useAuth } from '~/features/auth/composables/useAuth'

const { registerMutation } = useAuth()

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
})

const [fullName, fullNameAttrs] = defineField('fullName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  await registerMutation.mutateAsync({
    fullName: values.fullName,
    email: values.email,
    password: values.password
  })
})
</script>

<template>
  <form class="space-y-5" @submit="onSubmit">
    <AuthFormField
      id="fullName"
      v-model="fullName"
      v-bind="fullNameAttrs"
      label="Họ và tên"
      placeholder="Nguyễn Văn A"
      autocomplete="name"
      :error="errors.fullName"
      :disabled="isSubmitting || registerMutation.isPending.value"
    />

    <AuthFormField
      id="email"
      v-model="email"
      v-bind="emailAttrs"
      label="Email"
      type="email"
      placeholder="name@example.com"
      autocomplete="email"
      :error="errors.email"
      :disabled="isSubmitting || registerMutation.isPending.value"
    />

    <AuthFormField
      id="password"
      v-model="password"
      v-bind="passwordAttrs"
      label="Mật khẩu"
      type="password"
      placeholder="••••••••"
      autocomplete="new-password"
      :error="errors.password"
      :disabled="isSubmitting || registerMutation.isPending.value"
    />

    <AuthFormField
      id="confirmPassword"
      v-model="confirmPassword"
      v-bind="confirmPasswordAttrs"
      label="Xác nhận mật khẩu"
      type="password"
      placeholder="••••••••"
      autocomplete="new-password"
      :error="errors.confirmPassword"
      :disabled="isSubmitting || registerMutation.isPending.value"
    />

    <AppButton
      type="submit"
      class="w-full"
      :loading="isSubmitting || registerMutation.isPending.value"
      :disabled="isSubmitting || registerMutation.isPending.value"
    >
      Đăng ký
    </AppButton>

    <p class="text-center text-sm text-slate-500">
      Đã có tài khoản?
      <NuxtLink to="/login" class="font-medium text-brand-600 hover:text-brand-500">Đăng nhập</NuxtLink>
    </p>
  </form>
</template>
