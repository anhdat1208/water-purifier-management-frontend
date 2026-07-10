import type {
  AdminStats,
  AdminStatsApi,
  AdminUser,
  AdminUserApi,
  AdminUserCreateInput,
  SystemSettings,
  SystemSettingsApi
} from '~/features/admin/types/admin'

export function mapAdminUser(data: AdminUserApi): AdminUser {
  return {
    id: String(data.id),
    email: data.email,
    fullName: data.full_name ?? data.fullName ?? '',
    role: data.role,
    status: data.status,
    createdAt: data.created_at ?? data.createdAt ?? '',
    lastLoginAt: data.last_login_at ?? data.lastLoginAt
  }
}

export function mapAdminStats(data: AdminStatsApi): AdminStats {
  return {
    totalUsers: data.total_users ?? data.totalUsers ?? 0,
    activeUsers: data.active_users ?? data.activeUsers ?? 0,
    adminUsers: data.admin_users ?? data.adminUsers ?? 0,
    totalDevices: data.total_devices ?? data.totalDevices ?? 0,
    totalFilters: data.total_filters ?? data.totalFilters ?? 0,
    filtersDueSoon: data.filters_due_soon ?? data.filtersDueSoon ?? 0,
    systemStatus: data.system_status ?? data.systemStatus ?? 'healthy'
  }
}

export function mapSystemSettings(data: SystemSettingsApi): SystemSettings {
  return {
    siteName: data.site_name ?? data.siteName ?? '',
    maintenanceMode: data.maintenance_mode ?? data.maintenanceMode ?? false,
    filterWarningThreshold: data.filter_warning_threshold ?? data.filterWarningThreshold ?? 40,
    filterCriticalThreshold: data.filter_critical_threshold ?? data.filterCriticalThreshold ?? 20,
    notificationEmail: data.notification_email ?? data.notificationEmail ?? '',
    autoNotifyFilterDue: data.auto_notify_filter_due ?? data.autoNotifyFilterDue ?? true
  }
}

export function toAdminUserCreatePayload(input: AdminUserCreateInput) {
  return {
    email: input.email,
    full_name: input.fullName,
    role: input.role,
    status: input.status,
    password: input.password
  }
}

export function toAdminUserUpdatePayload(input: Partial<AdminUserCreateInput>) {
  return {
    ...(input.email !== undefined && { email: input.email }),
    ...(input.fullName !== undefined && { full_name: input.fullName }),
    ...(input.role !== undefined && { role: input.role }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.password !== undefined && { password: input.password })
  }
}

export function toSystemSettingsPayload(input: SystemSettings) {
  return {
    site_name: input.siteName,
    maintenance_mode: input.maintenanceMode,
    filter_warning_threshold: input.filterWarningThreshold,
    filter_critical_threshold: input.filterCriticalThreshold,
    notification_email: input.notificationEmail,
    auto_notify_filter_due: input.autoNotifyFilterDue
  }
}
