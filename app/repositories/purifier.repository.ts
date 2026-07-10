import {
  createMockPurifier,
  deleteMockPurifier,
  getMockPurifier,
  listMockPurifiers,
  updateMockPurifier
} from '~/features/purifiers/services/purifier-mock.service'
import type { Purifier, PurifierApi, PurifierCreateInput, PurifierUpdateInput } from '~/features/purifiers/types/purifier'
import type { ApiResponse } from '~/types/api'
import { mapPurifier, toPurifierCreatePayload, toPurifierUpdatePayload } from '~/services/purifier-mapper.service'

export function usePurifierRepository() {
  const api = useApiClient()
  const config = useRuntimeConfig()

  return {
    async list(): Promise<Purifier[]> {
      if (config.public.useMockApi) {
        return listMockPurifiers()
      }

      const response = await api.get<ApiResponse<PurifierApi[]>>('/purifiers')
      return response.data.data.map(mapPurifier)
    },

    async getById(id: string): Promise<Purifier> {
      if (config.public.useMockApi) {
        const item = await getMockPurifier(id)
        if (!item) {
          throw new Error('Không tìm thấy máy lọc.')
        }
        return item
      }

      const response = await api.get<ApiResponse<PurifierApi>>(`/purifiers/${id}`)
      return mapPurifier(response.data.data)
    },

    async create(input: PurifierCreateInput): Promise<Purifier> {
      if (config.public.useMockApi) {
        return createMockPurifier(input)
      }

      const response = await api.post<ApiResponse<PurifierApi>>('/purifiers', toPurifierCreatePayload(input))
      return mapPurifier(response.data.data)
    },

    async update(id: string, input: PurifierUpdateInput): Promise<Purifier> {
      if (config.public.useMockApi) {
        return updateMockPurifier(id, input)
      }

      const response = await api.put<ApiResponse<PurifierApi>>(
        `/purifiers/${id}`,
        toPurifierUpdatePayload(input)
      )
      return mapPurifier(response.data.data)
    },

    async remove(id: string): Promise<void> {
      if (config.public.useMockApi) {
        return deleteMockPurifier(id)
      }

      await api.delete(`/purifiers/${id}`)
    }
  }
}
