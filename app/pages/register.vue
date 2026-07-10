<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})
</script>

<template>
  <AppCard>
    <template #title>Tạo tài khoản</template>
    <p class="mb-6 text-sm text-slate-500">Đăng ký để bắt đầu quản lý máy lọc nước.</p>
    <RegisterForm />
  </AppCard>
</template>
