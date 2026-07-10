export interface DashboardStats {
  totalDevices: number
  activeDevices: number
  maintenanceDevices: number
  filtersDueSoon: number
}

export interface FilterLifeTrendPoint {
  label: string
  value: number
}

export interface StatusDistribution {
  active: number
  maintenance: number
  inactive: number
}

export interface DeviceAttentionItem {
  id: string
  name: string
  location: string
  filterLifePercent: number
  status: 'active' | 'maintenance' | 'inactive'
  reason: string
}

export type ActivityType = 'filter' | 'maintenance' | 'alert' | 'system'

export interface RecentActivityItem {
  id: string
  title: string
  description: string
  createdAt: string
  type: ActivityType
}

export interface DashboardOverview {
  stats: DashboardStats
  filterLifeTrend: FilterLifeTrendPoint[]
  statusDistribution: StatusDistribution
  devicesNeedingAttention: DeviceAttentionItem[]
  recentActivities: RecentActivityItem[]
}

export interface DashboardOverviewApi {
  stats: {
    total_devices?: number
    active_devices?: number
    maintenance_devices?: number
    filters_due_soon?: number
    totalDevices?: number
    activeDevices?: number
    maintenanceDevices?: number
    filtersDueSoon?: number
  }
  filter_life_trend?: Array<{ label: string; value: number }>
  filterLifeTrend?: FilterLifeTrendPoint[]
  status_distribution?: StatusDistribution
  statusDistribution?: StatusDistribution
  devices_needing_attention?: DeviceAttentionItemApi[]
  devicesNeedingAttention?: DeviceAttentionItem[]
  recent_activities?: RecentActivityItemApi[]
  recentActivities?: RecentActivityItem[]
}

interface DeviceAttentionItemApi {
  id: string | number
  name: string
  location: string
  filter_life_percent?: number
  filterLifePercent?: number
  status: 'active' | 'maintenance' | 'inactive'
  reason: string
}

interface RecentActivityItemApi {
  id: string
  title: string
  description: string
  created_at?: string
  createdAt?: string
  type: ActivityType
}
