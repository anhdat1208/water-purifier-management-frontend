<script setup lang="ts">
definePageMeta({
  layout: false
})

function retry() {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md text-center">
      <div
        class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white"
      >
        WP
      </div>
      <h1 class="text-xl font-semibold text-slate-900">Không có kết nối</h1>
      <p class="mt-2 text-sm text-slate-500">
        Kiểm tra mạng rồi thử lại. Một số dữ liệu cần kết nối API để tải.
      </p>
      <AppButton class="mt-6" @click="retry">Thử lại</AppButton>
    </div>
  </div>
</template>
