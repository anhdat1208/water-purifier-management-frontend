<script setup lang="ts">
import { suggestedPrompts } from '~/features/ai-assistant/constants/suggested-prompts'

interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  select: [prompt: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in suggestedPrompts"
      :key="item.id"
      type="button"
      class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled"
      @click="emit('select', item.prompt)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
