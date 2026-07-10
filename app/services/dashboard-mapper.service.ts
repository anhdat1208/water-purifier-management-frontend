import type {
  DashboardOverview,
  DashboardOverviewApi,
  DeviceAttentionItem,
  FilterLifeTrendPoint,
  RecentActivityItem
} from '~/features/dashboard/types/dashboard'

function mapStats(data: DashboardOverviewApi['stats']): DashboardOverview['stats'] {
  return {
    totalDevices: data.total_devices ?? data.totalDevices ?? 0,
    activeDevices: data.active_devices ?? data.activeDevices ?? 0,
    maintenanceDevices: data.maintenance_devices ?? data.maintenanceDevices ?? 0,
    filtersDueSoon: data.filters_due_soon ?? data.filtersDueSoon ?? 0
  }
}

function mapAttentionList(
  items: Array<{
    id: string | number
    name: string
    location: string
    filter_life_percent?: number
    filterLifePercent?: number
    status: 'active' | 'maintenance' | 'inactive'
    reason: string
  }>
): DeviceAttentionItem[] {
  return items.map((item) => ({
    id: String(item.id),
    name: item.name,
    location: item.location,
    filterLifePercent: item.filter_life_percent ?? item.filterLifePercent ?? 0,
    status: item.status,
    reason: item.reason
  }))
}

function mapActivities(
  items: Array<{
    id: string
    title: string
    description: string
    created_at?: string
    createdAt?: string
    type: RecentActivityItem['type']
  }>
): RecentActivityItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    createdAt: item.created_at ?? item.createdAt ?? '',
    type: item.type
  }))
}

export function mapDashboardOverview(data: DashboardOverviewApi): DashboardOverview {
  const trend = data.filter_life_trend ?? data.filterLifeTrend ?? []
  const distribution = data.status_distribution ?? data.statusDistribution ?? {
    active: 0,
    maintenance: 0,
    inactive: 0
  }
  const attention = data.devices_needing_attention ?? data.devicesNeedingAttention ?? []
  const activities = data.recent_activities ?? data.recentActivities ?? []

  return {
    stats: mapStats(data.stats),
    filterLifeTrend: trend as FilterLifeTrendPoint[],
    statusDistribution: distribution,
    devicesNeedingAttention: mapAttentionList(attention),
    recentActivities: mapActivities(activities)
  }
}
