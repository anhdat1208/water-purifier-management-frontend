<script setup lang="ts">
import { cn } from '~/utils/cn'
import { isNavItemActive } from '~/utils/nav'
import { mainNavItems, secondaryNavItems } from '~/constants/nav-items'
import { useAuth, useCurrentUser } from '~/features/auth/composables/useAuth'
import { useUserStore } from '~/stores/user.store'

const route = useRoute()
const { logout } = useAuth()
useCurrentUser()
const userStore = useUserStore()
const config = useRuntimeConfig()

const currentUser = computed(() => userStore.currentUser)
const isMockMode = computed(() => config.public.useMockApi)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div v-if="isMockMode" class="bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
      Chế độ demo — dữ liệu mẫu (chưa kết nối API thật)
    </div>

    <div class="mx-auto flex w-full max-w-[1440px]">
      <aside class="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
        <div class="mb-8 flex items-center gap-3 px-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white">
            WP
          </div>
          <div>
            <p class="font-semibold text-slate-900">Water Purifier</p>
            <p class="text-xs text-slate-500">Quản lý thiết bị</p>
          </div>
        </div>

        <nav class="space-y-1">
          <template v-for="item in mainNavItems" :key="item.to">
            <NuxtLink
              v-if="!item.disabled"
              :to="item.to"
              :class="
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isNavItemActive(route.path, item.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              "
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </NuxtLink>
            <span
              v-else
              class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400"
              :title="'Sắp có ở phase tiếp theo'"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </span>
          </template>
        </nav>

        <div class="my-6 border-t border-slate-200" />

        <nav class="space-y-1">
          <template v-for="item in secondaryNavItems" :key="item.to">
            <NuxtLink
              v-if="!item.disabled"
              :to="item.to"
              :class="
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isNavItemActive(route.path, item.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              "
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </NuxtLink>
            <span
              v-else
              class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400"
              :title="'Sắp có ở phase tiếp theo'"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </span>
          </template>
        </nav>

        <div class="mt-auto border-t border-slate-200 px-2 pt-4">
          <PwaInstallButton />
        </div>
      </aside>

      <div class="flex min-h-screen flex-1 flex-col">
        <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
          <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 lg:hidden">
            <AppMobileNav />
            <p class="font-semibold text-slate-900">Water Purifier</p>
          </div>
            <div class="ml-auto flex items-center gap-3">
              <div v-if="currentUser" class="hidden text-right sm:block">
                <p class="text-sm font-medium text-slate-900">{{ currentUser.fullName }}</p>
                <p class="text-xs text-slate-500">{{ currentUser.email }}</p>
              </div>
              <AppButton class="bg-slate-800 hover:bg-slate-700" @click="logout">Đăng xuất</AppButton>
            </div>
          </div>
        </header>

        <main class="flex-1 px-4 py-6 sm:px-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
