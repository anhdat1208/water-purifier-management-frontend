<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

interface Props {
  label: string
  id: string
  modelValue?: string
  type?: string
  placeholder?: string
  error?: string
  autocomplete?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="space-y-1.5">
    <label :for="id" class="block text-sm font-medium text-slate-700">{{ label }}</label>
    <AppInput
      :id="id"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :error="Boolean(error)"
      v-bind="$attrs"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
