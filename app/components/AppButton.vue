<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  class?: string
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  loading: false,
  disabled: false
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="
      cn(
        'inline-flex h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60',
        $props.class
      )
    "
  >
    <AppLoading v-if="loading" class="mr-2" />
    <slot />
  </button>
</template>
