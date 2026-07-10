import { getDashboardMockOverview } from '~/features/dashboard/services/dashboard-mock.service'
import type { DashboardOverview, DashboardOverviewApi } from '~/features/dashboard/types/dashboard'
import type { ApiResponse } from '~/types/api'
import { mapDashboardOverview } from '~/services/dashboard-mapper.service'

export function useDashboardRepository() {
  const api = useApiClient()
  const config = useRuntimeConfig()

  return {
    async getOverview(): Promise<DashboardOverview> {
      if (config.public.useMockApi) {
        return getDashboardMockOverview()
      }

      const response = await api.get<ApiResponse<DashboardOverviewApi>>('/dashboard/overview')
      return mapDashboardOverview(response.data.data)
    }
  }
}
