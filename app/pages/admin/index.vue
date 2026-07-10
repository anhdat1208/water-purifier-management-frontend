<script setup lang="ts">
import { Droplets, Filter, Shield, Users } from '@lucide/vue'
import { useAdminStats } from '~/features/admin/composables/useAdmin'

definePageMeta({
  layout: 'app',
  middleware: ['auth', 'admin']
})

const { data: stats, isLoading, isError, refetch } = useAdminStats()
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Quản trị hệ thống</h1>
      <p class="mt-1 text-sm text-slate-500">Tổng quan người dùng, thiết bị và trạng thái hệ thống.</p>
    </div>

    <AdminSubNav />

    <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AppSkeleton v-for="i in 4" :key="i" class="h-28" />
    </div>

    <div v-else-if="isError" class="space-y-4">
      <AppEmpty title="Không tải được dữ liệu quản trị" description="Vui lòng thử lại sau." />
      <AppButton @click="refetch()">Thử lại</AppButton>
    </div>

    <template v-else-if="stats">
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-sm text-slate-500">Trạng thái hệ thống:</span>
        <AdminSystemStatusBadge :status="stats.systemStatus" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Tổng người dùng"
          :value="stats.totalUsers"
          :hint="`${stats.activeUsers} đang hoạt động`"
          :icon="Users"
        />
        <DashboardStatCard
          label="Quản trị viên"
          :value="stats.adminUsers"
          hint="Tài khoản có quyền admin"
          :icon="Shield"
          tone="warning"
        />
        <DashboardStatCard
          label="Thiết bị"
          :value="stats.totalDevices"
          :hint="`${stats.totalFilters} lõi lọc`"
          :icon="Droplets"
        />
        <DashboardStatCard
          label="Lõi sắp thay"
          :value="stats.filtersDueSoon"
          hint="Cần theo dõi"
          :icon="Filter"
          tone="danger"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <AppCard>
          <template #title>Quản lý nhanh</template>
          <div class="space-y-2">
            <NuxtLink
              to="/admin/users"
              class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm transition hover:bg-slate-50"
            >
              <span class="font-medium text-slate-900">Quản lý người dùng</span>
              <Users class="h-4 w-4 text-slate-400" />
            </NuxtLink>
            <NuxtLink
              to="/admin/settings"
              class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm transition hover:bg-slate-50"
            >
              <span class="font-medium text-slate-900">Cài đặt hệ thống</span>
              <Shield class="h-4 w-4 text-slate-400" />
            </NuxtLink>
          </div>
        </AppCard>

        <AppCard>
          <template #title>Ghi chú</template>
          <p class="text-sm leading-relaxed text-slate-600">
            Khu vực quản trị chỉ dành cho tài khoản có vai trò <strong>Quản trị</strong>.
            Trong chế độ demo, dữ liệu người dùng và cài đặt là mẫu — sẽ đồng bộ với API thật khi backend sẵn sàng.
          </p>
        </AppCard>
      </div>
    </template>
  </section>
</template>
