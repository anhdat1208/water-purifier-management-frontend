<script setup lang="ts">
import { cn } from '~/utils/cn'
import { adminNavItems } from '~/features/admin/constants/nav-items'

const route = useRoute()

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}
</script>

<template>
  <nav class="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
    <NuxtLink
      v-for="item in adminNavItems"
      :key="item.to"
      :to="item.to"
      :class="
        cn(
          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition',
          isActive(item.to)
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )
      "
    >
      <component :is="item.icon" class="h-4 w-4" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
