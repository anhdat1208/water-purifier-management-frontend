<script setup lang="ts">
import { Send } from '@lucide/vue'

interface Props {
  modelValue: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    emit('submit')
  }
}

function adjustHeight() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

watch(
  () => props.modelValue,
  () => nextTick(adjustHeight)
)
</script>

<template>
  <div class="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-200">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      rows="1"
      placeholder="Nhập câu hỏi về máy lọc, lõi lọc, bảo trì..."
      class="max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="disabled || loading"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @keydown="handleKeydown"
    />
    <AppButton
      type="button"
      class="h-11 w-11 shrink-0 rounded-xl p-0"
      :loading="loading"
      :disabled="disabled || !modelValue.trim()"
      @click="emit('submit')"
    >
      <Send class="h-4 w-4" />
    </AppButton>
  </div>
</template>
