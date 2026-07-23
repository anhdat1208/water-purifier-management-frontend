<script setup lang="ts">
import { Download } from '@lucide/vue'

const { canInstall, install } = usePwaInstall()
const installing = ref(false)

async function onInstall() {
  installing.value = true
  try {
    await install()
  } finally {
    installing.value = false
  }
}
</script>

<template>
  <AppButton
    v-if="canInstall"
    :loading="installing"
    class="w-full bg-brand-600 hover:bg-brand-500"
    @click="onInstall"
  >
    <Download class="mr-2 h-4 w-4" />
    Cài đặt ứng dụng
  </AppButton>
</template>
