import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useApiError } from '~/composables/useApiError'
import { useAppToast } from '~/composables/useAppToast'
import { filterQueryKeys } from '~/features/filters/constants/query-keys'
import type { FilterCreateInput, FilterUpdateInput } from '~/features/filters/types/filter'
import { useFilterRepository } from '~/repositories/filter.repository'

export function useFilterList() {
  const repo = useFilterRepository()

  return useQuery({
    queryKey: filterQueryKeys.list,
    queryFn: () => repo.list(),
    staleTime: 30_000
  })
}

export function useFilterDetail(id: Ref<string> | string) {
  const repo = useFilterRepository()
  const filterId = computed(() => (typeof id === 'string' ? id : id.value))

  return useQuery({
    queryKey: computed(() => filterQueryKeys.detail(filterId.value)),
    queryFn: () => repo.getById(filterId.value),
    enabled: computed(() => Boolean(filterId.value))
  })
}

export function useFilterMutations() {
  const repo = useFilterRepository()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()
  const toast = useAppToast()

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: filterQueryKeys.list })
  }

  const createMutation = useMutation({
    mutationFn: (input: FilterCreateInput) => repo.create(input),
    onSuccess: () => {
      invalidateList()
      toast.success('Đã thêm lõi lọc mới.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể thêm lõi lọc.'))
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: FilterUpdateInput }) => repo.update(id, input),
    onSuccess: (_data, variables) => {
      invalidateList()
      queryClient.invalidateQueries({ queryKey: filterQueryKeys.detail(variables.id) })
      toast.success('Đã cập nhật lõi lọc.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể cập nhật lõi lọc.'))
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => repo.remove(id),
    onSuccess: () => {
      invalidateList()
      toast.success('Đã xóa lõi lọc.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể xóa lõi lọc.'))
    }
  })

  const replaceMutation = useMutation({
    mutationFn: (id: string) => repo.replace(id),
    onSuccess: (_data, id) => {
      invalidateList()
      queryClient.invalidateQueries({ queryKey: filterQueryKeys.detail(id) })
      toast.success('Đã ghi nhận thay lõi lọc.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể ghi nhận thay lõi.'))
    }
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    replaceMutation
  }
}
