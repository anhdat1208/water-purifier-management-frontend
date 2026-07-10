<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  class?: string
}

defineProps<Props>()
</script>

<template>
  <span :class="cn('inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white', $props.class)" />
</template>
