<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Khong co du lieu',
  description: 'Du lieu se hien thi tai day khi san sang.'
})
</script>

<template>
  <div class="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
    <p class="text-base font-medium">{{ title }}</p>
    <p class="mt-1 text-sm text-slate-500">{{ description }}</p>
  </div>
</template>
