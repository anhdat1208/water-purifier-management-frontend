import type {
  AdminStats,
  AdminUser,
  AdminUserCreateInput,
  AdminUserUpdateInput,
  SystemSettings
} from '~/features/admin/types/admin'

let nextUserId = 7

const users: AdminUser[] = [
  {
    id: '1',
    email: 'admin@waterpurifier.local',
    fullName: 'Quản trị viên',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T08:00:00.000Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'nguyen.van.a@example.com',
    fullName: 'Nguyễn Văn A',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-20T10:30:00.000Z',
    lastLoginAt: '2026-07-09T14:22:00.000Z'
  },
  {
    id: '3',
    email: 'tran.thi.b@example.com',
    fullName: 'Trần Thị B',
    role: 'user',
    status: 'active',
    createdAt: '2024-05-10T09:15:00.000Z',
    lastLoginAt: '2026-07-08T09:10:00.000Z'
  },
  {
    id: '4',
    email: 'le.van.c@example.com',
    fullName: 'Lê Văn C',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-08-01T11:00:00.000Z',
    lastLoginAt: '2026-05-15T16:45:00.000Z'
  },
  {
    id: '5',
    email: 'pham.thi.d@example.com',
    fullName: 'Phạm Thị D',
    role: 'user',
    status: 'active',
    createdAt: '2025-02-14T08:45:00.000Z',
    lastLoginAt: '2026-07-10T07:30:00.000Z'
  },
  {
    id: '6',
    email: 'hoang.van.e@example.com',
    fullName: 'Hoàng Văn E',
    role: 'admin',
    status: 'active',
    createdAt: '2025-06-01T13:20:00.000Z',
    lastLoginAt: '2026-07-07T11:00:00.000Z'
  }
]

let settings: SystemSettings = {
  siteName: 'Water Purifier Management',
  maintenanceMode: false,
  filterWarningThreshold: 40,
  filterCriticalThreshold: 20,
  notificationEmail: 'alerts@waterpurifier.local',
  autoNotifyFilterDue: true
}

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getMockAdminStats(): Promise<AdminStats> {
  await delay()
  const activeUsers = users.filter((u) => u.status === 'active').length
  const adminUsers = users.filter((u) => u.role === 'admin').length
  return {
    totalUsers: users.length,
    activeUsers,
    adminUsers,
    totalDevices: 5,
    totalFilters: 15,
    filtersDueSoon: 6,
    systemStatus: settings.maintenanceMode ? 'warning' : 'healthy'
  }
}

export async function listMockAdminUsers(): Promise<AdminUser[]> {
  await delay()
  return users.map((u) => ({ ...u }))
}

export async function getMockAdminUser(id: string): Promise<AdminUser | null> {
  await delay()
  const user = users.find((u) => u.id === id)
  return user ? { ...user } : null
}

export async function createMockAdminUser(input: AdminUserCreateInput): Promise<AdminUser> {
  await delay()
  const exists = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())
  if (exists) {
    throw new Error('Email đã được sử dụng.')
  }
  const user: AdminUser = {
    id: String(nextUserId++),
    email: input.email,
    fullName: input.fullName,
    role: input.role,
    status: input.status,
    createdAt: new Date().toISOString()
  }
  users.unshift(user)
  return { ...user }
}

export async function updateMockAdminUser(id: string, input: AdminUserUpdateInput): Promise<AdminUser> {
  await delay()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy người dùng.')
  }
  const current = users[index]
  if (!current) {
    throw new Error('Không tìm thấy người dùng.')
  }
  if (input.email && input.email.toLowerCase() !== current.email.toLowerCase()) {
    const exists = users.some((u) => u.id !== id && u.email.toLowerCase() === input.email!.toLowerCase())
    if (exists) {
      throw new Error('Email đã được sử dụng.')
    }
  }
  const updated: AdminUser = {
    id: current.id,
    email: input.email ?? current.email,
    fullName: input.fullName ?? current.fullName,
    role: input.role ?? current.role,
    status: input.status ?? current.status,
    createdAt: current.createdAt,
    lastLoginAt: current.lastLoginAt
  }
  users[index] = updated
  return { ...updated }
}

export async function deleteMockAdminUser(id: string): Promise<void> {
  await delay()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy người dùng.')
  }
  if (users[index]?.role === 'admin') {
    const adminCount = users.filter((u) => u.role === 'admin').length
    if (adminCount <= 1) {
      throw new Error('Không thể xóa quản trị viên cuối cùng.')
    }
  }
  users.splice(index, 1)
}

export async function getMockSystemSettings(): Promise<SystemSettings> {
  await delay()
  return { ...settings }
}

export async function updateMockSystemSettings(input: SystemSettings): Promise<SystemSettings> {
  await delay()
  settings = { ...input }
  return { ...settings }
}
