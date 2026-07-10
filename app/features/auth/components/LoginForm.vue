<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { loginSchema } from '~/features/auth/schemas/login.schema'
import { useAuth } from '~/features/auth/composables/useAuth'

const { loginMutation } = useAuth()

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: '',
    password: ''
  }
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  await loginMutation.mutateAsync(values)
})
</script>

<template>
  <form class="space-y-5" @submit="onSubmit">
    <AuthFormField
      id="email"
      v-model="email"
      v-bind="emailAttrs"
      label="Email"
      type="email"
      placeholder="name@example.com"
      autocomplete="email"
      :error="errors.email"
      :disabled="isSubmitting || loginMutation.isPending.value"
    />

    <AuthFormField
      id="password"
      v-model="password"
      v-bind="passwordAttrs"
      label="Mật khẩu"
      type="password"
      placeholder="••••••••"
      autocomplete="current-password"
      :error="errors.password"
      :disabled="isSubmitting || loginMutation.isPending.value"
    />

    <div class="flex items-center justify-end">
      <NuxtLink to="/forgot-password" class="text-sm text-brand-600 hover:text-brand-500">
        Quên mật khẩu?
      </NuxtLink>
    </div>

    <AppButton
      type="submit"
      class="w-full"
      :loading="isSubmitting || loginMutation.isPending.value"
      :disabled="isSubmitting || loginMutation.isPending.value"
    >
      Đăng nhập
    </AppButton>

    <p class="text-center text-sm text-slate-500">
      Chưa có tài khoản?
      <NuxtLink to="/register" class="font-medium text-brand-600 hover:text-brand-500">Đăng ký</NuxtLink>
    </p>
  </form>
</template>
