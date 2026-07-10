<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})
</script>

<template>
  <AppCard>
    <template #title>Quên mật khẩu</template>
    <ForgotPasswordForm />
  </AppCard>
</template>
