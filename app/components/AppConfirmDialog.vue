<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Xac nhan thao tac',
  description: 'Ban co chac chan muon tiep tuc?'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <AppModal :open="open" @close="emit('cancel')">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-500">{{ description }}</p>
    <div class="mt-5 flex justify-end gap-2">
      <AppButton class="bg-slate-200 text-slate-800 hover:bg-slate-300" @click="emit('cancel')">Huy</AppButton>
      <AppButton @click="emit('confirm')">Dong y</AppButton>
    </div>
  </AppModal>
</template>
