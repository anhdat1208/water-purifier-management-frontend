<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { forgotPasswordSchema } from '~/features/auth/schemas/forgot-password.schema'
import { useAuth } from '~/features/auth/composables/useAuth'

const { forgotPasswordMutation } = useAuth()

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema),
  initialValues: {
    email: ''
  }
})

const [email, emailAttrs] = defineField('email')

const onSubmit = handleSubmit(async (values) => {
  await forgotPasswordMutation.mutateAsync(values)
})
</script>

<template>
  <form class="space-y-5" @submit="onSubmit">
    <p class="text-sm text-slate-500">
      Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
    </p>

    <AuthFormField
      id="email"
      v-model="email"
      v-bind="emailAttrs"
      label="Email"
      type="email"
      placeholder="name@example.com"
      autocomplete="email"
      :error="errors.email"
      :disabled="isSubmitting || forgotPasswordMutation.isPending.value"
    />

    <AppButton
      type="submit"
      class="w-full"
      :loading="isSubmitting || forgotPasswordMutation.isPending.value"
      :disabled="isSubmitting || forgotPasswordMutation.isPending.value"
    >
      Gửi liên kết
    </AppButton>

    <p class="text-center text-sm text-slate-500">
      <NuxtLink to="/login" class="font-medium text-brand-600 hover:text-brand-500">Quay lại đăng nhập</NuxtLink>
    </p>
  </form>
</template>
