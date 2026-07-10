<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const statusCode = computed(() => props.error.statusCode ?? 500)
const title = computed(() => {
  if (statusCode.value === 404) return 'Không tìm thấy trang'
  return 'Đã xảy ra lỗi'
})
const description = computed(() => {
  if (statusCode.value === 404) {
    return 'Trang bạn tìm không tồn tại hoặc đã bị di chuyển.'
  }
  return props.error.message || 'Vui lòng thử lại sau.'
})

function handleRetry() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <AppCard class="w-full max-w-md text-center">
      <p class="text-5xl font-semibold text-slate-300">{{ statusCode }}</p>
      <h1 class="mt-4 text-xl font-semibold text-slate-900">{{ title }}</h1>
      <p class="mt-2 text-sm text-slate-500">{{ description }}</p>
      <div class="mt-6 flex justify-center gap-3">
        <AppButton class="bg-slate-200 text-slate-800 hover:bg-slate-300" @click="handleRetry">
          Về trang chủ
        </AppButton>
        <AppButton @click="reloadNuxtApp()">Tải lại</AppButton>
      </div>
    </AppCard>
  </div>
</template>
