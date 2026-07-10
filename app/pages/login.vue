<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})
</script>

<template>
  <AppCard>
    <template #title>Đăng nhập</template>
    <p class="mb-6 text-sm text-slate-500">Đăng nhập để tiếp tục sử dụng hệ thống.</p>
    <LoginForm />
  </AppCard>
</template>
