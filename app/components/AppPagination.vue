<script setup lang="ts">
interface Props {
  page: number
  totalPages: number
}

defineProps<Props>()

const emit = defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <AppButton :disabled="page <= 1" class="bg-slate-800 hover:bg-slate-700" @click="emit('change', page - 1)">
      Truoc
    </AppButton>
    <span class="text-sm text-slate-600">{{ page }} / {{ totalPages }}</span>
    <AppButton
      :disabled="page >= totalPages"
      class="bg-slate-800 hover:bg-slate-700"
      @click="emit('change', page + 1)"
    >
      Sau
    </AppButton>
  </div>
</template>
