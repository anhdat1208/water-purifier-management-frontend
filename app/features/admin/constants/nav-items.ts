import { LayoutDashboard, Settings, Users } from '@lucide/vue'
import type { Component } from 'vue'

export interface AdminNavItem {
  label: string
  to: string
  icon: Component
}

export const adminNavItems: AdminNavItem[] = [
  { label: 'Tổng quan', to: '/admin', icon: LayoutDashboard },
  { label: 'Người dùng', to: '/admin/users', icon: Users },
  { label: 'Cài đặt', to: '/admin/settings', icon: Settings }
]
