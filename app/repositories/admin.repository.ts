import {
  createMockAdminUser,
  deleteMockAdminUser,
  getMockAdminStats,
  getMockAdminUser,
  getMockSystemSettings,
  listMockAdminUsers,
  updateMockAdminUser,
  updateMockSystemSettings
} from '~/features/admin/services/admin-mock.service'
import type {
  AdminStats,
  AdminStatsApi,
  AdminUser,
  AdminUserApi,
  AdminUserCreateInput,
  AdminUserUpdateInput,
  SystemSettings,
  SystemSettingsApi
} from '~/features/admin/types/admin'
import type { ApiResponse } from '~/types/api'
import {
  mapAdminStats,
  mapAdminUser,
  mapSystemSettings,
  toAdminUserCreatePayload,
  toAdminUserUpdatePayload,
  toSystemSettingsPayload
} from '~/services/admin-mapper.service'

export function useAdminRepository() {
  const api = useApiClient()
  const config = useRuntimeConfig()

  return {
    async getStats(): Promise<AdminStats> {
      if (config.public.useMockApi) {
        return getMockAdminStats()
      }
      const response = await api.get<ApiResponse<AdminStatsApi>>('/admin/stats')
      return mapAdminStats(response.data.data)
    },

    async listUsers(): Promise<AdminUser[]> {
      if (config.public.useMockApi) {
        return listMockAdminUsers()
      }
      const response = await api.get<ApiResponse<AdminUserApi[]>>('/admin/users')
      return response.data.data.map(mapAdminUser)
    },

    async getUser(id: string): Promise<AdminUser> {
      if (config.public.useMockApi) {
        const user = await getMockAdminUser(id)
        if (!user) throw new Error('Không tìm thấy người dùng.')
        return user
      }
      const response = await api.get<ApiResponse<AdminUserApi>>(`/admin/users/${id}`)
      return mapAdminUser(response.data.data)
    },

    async createUser(input: AdminUserCreateInput): Promise<AdminUser> {
      if (config.public.useMockApi) {
        return createMockAdminUser(input)
      }
      const response = await api.post<ApiResponse<AdminUserApi>>(
        '/admin/users',
        toAdminUserCreatePayload(input)
      )
      return mapAdminUser(response.data.data)
    },

    async updateUser(id: string, input: AdminUserUpdateInput): Promise<AdminUser> {
      if (config.public.useMockApi) {
        return updateMockAdminUser(id, input)
      }
      const response = await api.put<ApiResponse<AdminUserApi>>(
        `/admin/users/${id}`,
        toAdminUserUpdatePayload(input)
      )
      return mapAdminUser(response.data.data)
    },

    async removeUser(id: string): Promise<void> {
      if (config.public.useMockApi) {
        return deleteMockAdminUser(id)
      }
      await api.delete(`/admin/users/${id}`)
    },

    async getSettings(): Promise<SystemSettings> {
      if (config.public.useMockApi) {
        return getMockSystemSettings()
      }
      const response = await api.get<ApiResponse<SystemSettingsApi>>('/admin/settings')
      return mapSystemSettings(response.data.data)
    },

    async updateSettings(input: SystemSettings): Promise<SystemSettings> {
      if (config.public.useMockApi) {
        return updateMockSystemSettings(input)
      }
      const response = await api.put<ApiResponse<SystemSettingsApi>>(
        '/admin/settings',
        toSystemSettingsPayload(input)
      )
      return mapSystemSettings(response.data.data)
    }
  }
}
