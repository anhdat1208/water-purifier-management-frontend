import {
  createMockFilter,
  deleteMockFilter,
  getMockFilter,
  listMockFilters,
  replaceMockFilter,
  updateMockFilter
} from '~/features/filters/services/filter-mock.service'
import type { Filter, FilterApi, FilterCreateInput, FilterUpdateInput } from '~/features/filters/types/filter'
import type { ApiResponse } from '~/types/api'
import { mapFilter, toFilterCreatePayload, toFilterUpdatePayload } from '~/services/filter-mapper.service'

export function useFilterRepository() {
  const api = useApiClient()
  const config = useRuntimeConfig()

  return {
    async list(): Promise<Filter[]> {
      if (config.public.useMockApi) {
        return listMockFilters()
      }

      const response = await api.get<ApiResponse<FilterApi[]>>('/filters')
      return response.data.data.map(mapFilter)
    },

    async getById(id: string): Promise<Filter> {
      if (config.public.useMockApi) {
        const item = await getMockFilter(id)
        if (!item) {
          throw new Error('Không tìm thấy lõi lọc.')
        }
        return item
      }

      const response = await api.get<ApiResponse<FilterApi>>(`/filters/${id}`)
      return mapFilter(response.data.data)
    },

    async create(input: FilterCreateInput): Promise<Filter> {
      if (config.public.useMockApi) {
        return createMockFilter(input)
      }

      const response = await api.post<ApiResponse<FilterApi>>('/filters', toFilterCreatePayload(input))
      return mapFilter(response.data.data)
    },

    async update(id: string, input: FilterUpdateInput): Promise<Filter> {
      if (config.public.useMockApi) {
        return updateMockFilter(id, input)
      }

      const response = await api.put<ApiResponse<FilterApi>>(`/filters/${id}`, toFilterUpdatePayload(input))
      return mapFilter(response.data.data)
    },

    async remove(id: string): Promise<void> {
      if (config.public.useMockApi) {
        return deleteMockFilter(id)
      }

      await api.delete(`/filters/${id}`)
    },

    async replace(id: string): Promise<Filter> {
      if (config.public.useMockApi) {
        return replaceMockFilter(id)
      }

      const response = await api.post<ApiResponse<FilterApi>>(`/filters/${id}/replace`)
      return mapFilter(response.data.data)
    }
  }
}
