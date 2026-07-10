import { useQuery } from '@tanstack/vue-query'
import { dashboardQueryKeys } from '~/features/dashboard/constants/query-keys'
import { useDashboardRepository } from '~/repositories/dashboard.repository'

export function useDashboardOverview() {
  const repo = useDashboardRepository()

  return useQuery({
    queryKey: dashboardQueryKeys.overview,
    queryFn: () => repo.getOverview(),
    staleTime: 60_000
  })
}
