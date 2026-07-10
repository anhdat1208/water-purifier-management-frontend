<script setup lang="ts">
import { cn } from '~/utils/cn'
import type { Component } from 'vue'

interface Props {
  label: string
  value: string | number
  hint?: string
  icon: Component
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

withDefaults(defineProps<Props>(), {
  hint: '',
  tone: 'default'
})

const toneClasses: Record<NonNullable<Props['tone']>, string> = {
  default: 'bg-brand-50 text-brand-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600'
}
</script>

<template>
  <AppCard class="p-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm text-slate-500">{{ label }}</p>
        <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{{ value }}</p>
        <p v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
      </div>
      <div :class="cn('flex h-11 w-11 items-center justify-center rounded-2xl', toneClasses[tone])">
        <component :is="icon" class="h-5 w-5" />
      </div>
    </div>
  </AppCard>
</template>
