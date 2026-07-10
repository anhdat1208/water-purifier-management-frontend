<script setup lang="ts">
interface Props {
  open: boolean
}

defineProps<Props>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" @click.self="emit('close')">
    <div class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
      <slot />
    </div>
  </div>
</template>
