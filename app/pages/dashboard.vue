<script setup lang="ts">
import { AlertTriangle, CheckCircle2, Droplets, Wrench } from '@lucide/vue'
import { useDashboardOverview } from '~/features/dashboard/composables/useDashboard'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const { data, isLoading, isError, refetch, isFetching } = useDashboardOverview()
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
      <p class="mt-1 text-sm text-slate-500">Tổng quan tình trạng máy lọc và lõi lọc trong hệ thống.</p>
    </div>

    <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AppSkeleton v-for="index in 4" :key="index" class="h-32" />
    </div>

    <div v-else-if="isError" class="space-y-4">
      <AppEmpty
        title="Không tải được dữ liệu dashboard"
        description="Vui lòng kiểm tra kết nối API hoặc bật chế độ demo trong file .env."
      />
      <AppButton :loading="isFetching" @click="refetch()">Thử lại</AppButton>
    </div>

    <template v-else-if="data">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Tổng thiết bị"
          :value="data.stats.totalDevices"
          hint="Tất cả máy lọc đang quản lý"
          :icon="Droplets"
        />
        <DashboardStatCard
          label="Đang hoạt động"
          :value="data.stats.activeDevices"
          hint="Vận hành bình thường"
          tone="success"
          :icon="CheckCircle2"
        />
        <DashboardStatCard
          label="Cần bảo trì"
          :value="data.stats.maintenanceDevices"
          hint="Cần kiểm tra sớm"
          tone="warning"
          :icon="Wrench"
        />
        <DashboardStatCard
          label="Sắp thay lõi"
          :value="data.stats.filtersDueSoon"
          hint="Tuổi thọ lõi dưới ngưỡng"
          tone="danger"
          :icon="AlertTriangle"
        />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <DashboardFilterLifeChart :data="data.filterLifeTrend" />
        <DashboardStatusChart :data="data.statusDistribution" />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <DashboardAttentionList :items="data.devicesNeedingAttention" />
        <DashboardRecentActivity :items="data.recentActivities" />
      </div>
    </template>
  </section>
</template>
