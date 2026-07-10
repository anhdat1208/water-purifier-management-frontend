<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  class?: string
}

defineProps<Props>()
</script>

<template>
  <article :class="cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm', $props.class)">
    <header v-if="$slots.title" class="mb-3">
      <h3 class="text-lg font-semibold text-slate-900">
        <slot name="title" />
      </h3>
    </header>
    <slot />
  </article>
</template>
