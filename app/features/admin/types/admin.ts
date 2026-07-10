export type AdminUserRole = 'admin' | 'user'
export type AdminUserStatus = 'active' | 'inactive'
export type SystemHealthStatus = 'healthy' | 'warning' | 'critical'

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: AdminUserRole
  status: AdminUserStatus
  createdAt: string
  lastLoginAt?: string
}

export interface AdminUserCreateInput {
  email: string
  fullName: string
  role: AdminUserRole
  status: AdminUserStatus
  password: string
}

export type AdminUserUpdateInput = Partial<Omit<AdminUserCreateInput, 'password'>> & {
  password?: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  totalDevices: number
  totalFilters: number
  filtersDueSoon: number
  systemStatus: SystemHealthStatus
}

export interface SystemSettings {
  siteName: string
  maintenanceMode: boolean
  filterWarningThreshold: number
  filterCriticalThreshold: number
  notificationEmail: string
  autoNotifyFilterDue: boolean
}

export interface AdminUserApi {
  id: string | number
  email: string
  full_name?: string
  fullName?: string
  role: AdminUserRole
  status: AdminUserStatus
  created_at?: string
  createdAt?: string
  last_login_at?: string
  lastLoginAt?: string
}

export interface AdminStatsApi {
  total_users?: number
  totalUsers?: number
  active_users?: number
  activeUsers?: number
  admin_users?: number
  adminUsers?: number
  total_devices?: number
  totalDevices?: number
  total_filters?: number
  totalFilters?: number
  filters_due_soon?: number
  filtersDueSoon?: number
  system_status?: SystemHealthStatus
  systemStatus?: SystemHealthStatus
}

export interface SystemSettingsApi {
  site_name?: string
  siteName?: string
  maintenance_mode?: boolean
  maintenanceMode?: boolean
  filter_warning_threshold?: number
  filterWarningThreshold?: number
  filter_critical_threshold?: number
  filterCriticalThreshold?: number
  notification_email?: string
  notificationEmail?: string
  auto_notify_filter_due?: boolean
  autoNotifyFilterDue?: boolean
}
