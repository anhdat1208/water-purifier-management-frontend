<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  id?: string
  name?: string
  disabled?: boolean
  autocomplete?: string
  error?: boolean
  class?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    :id="id"
    :name="name"
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :autocomplete="autocomplete"
    :class="
      cn(
        'h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition focus:ring-2',
        error
          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
          : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200',
        disabled && 'cursor-not-allowed bg-slate-100 opacity-70',
        $props.class
      )
    "
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
