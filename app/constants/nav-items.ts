import {
  LayoutDashboard,
  Droplets,
  Filter,
  History,
  Bell,
  Bot,
  User,
  Shield
} from '@lucide/vue'
import type { Component } from 'vue'

export interface NavItem {
  label: string
  to: string
  icon: Component
  disabled?: boolean
}

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Máy lọc nước', to: '/purifiers', icon: Droplets },
  { label: 'Lõi lọc', to: '/filters', icon: Filter },
  { label: 'Lịch sử thay lõi', to: '/replacement-history', icon: History, disabled: true },
  { label: 'Thông báo', to: '/notifications', icon: Bell, disabled: true },
  { label: 'Trợ lý AI', to: '/ai-assistant', icon: Bot },
]

export const secondaryNavItems: NavItem[] = [
  { label: 'Hồ sơ', to: '/profile', icon: User, disabled: true },
  { label: 'Quản trị', to: '/admin', icon: Shield }
]
