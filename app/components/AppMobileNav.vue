<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { cn } from '~/utils/cn'
import { isNavItemActive } from '~/utils/nav'
import { mainNavItems, secondaryNavItems } from '~/constants/nav-items'

const route = useRoute()
const open = ref(false)

watch(
  () => route.path,
  () => {
    open.value = false
  }
)
</script>

<template>
  <div class="lg:hidden">
    <button
      type="button"
      class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
      aria-label="Mở menu"
      @click="open = true"
    >
      <Menu class="h-5 w-5" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/40"
        @click="open = false"
      />
      <aside
        v-if="open"
        class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl"
      >
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <p class="font-semibold text-slate-900">Menu</p>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Đóng menu"
            @click="open = false"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <nav class="flex-1 space-y-1 overflow-y-auto p-4">
          <template v-for="item in mainNavItems" :key="item.to">
            <NuxtLink
              v-if="!item.disabled"
              :to="item.to"
              :class="
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isNavItemActive(route.path, item.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              "
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </NuxtLink>
            <span
              v-else
              class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </span>
          </template>

          <div class="my-4 border-t border-slate-200" />

          <template v-for="item in secondaryNavItems" :key="item.to">
            <NuxtLink
              v-if="!item.disabled"
              :to="item.to"
              :class="
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isNavItemActive(route.path, item.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              "
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </NuxtLink>
            <span
              v-else
              class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </span>
          </template>
        </nav>
      </aside>
    </Teleport>
  </div>
</template>
