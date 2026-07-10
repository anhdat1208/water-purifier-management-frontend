import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useApiError } from '~/composables/useApiError'
import { useAppToast } from '~/composables/useAppToast'
import { purifierQueryKeys } from '~/features/purifiers/constants/query-keys'
import type { PurifierCreateInput, PurifierUpdateInput } from '~/features/purifiers/types/purifier'
import { usePurifierRepository } from '~/repositories/purifier.repository'

export function usePurifierList() {
  const repo = usePurifierRepository()

  return useQuery({
    queryKey: purifierQueryKeys.list,
    queryFn: () => repo.list(),
    staleTime: 30_000
  })
}

export function usePurifierDetail(id: Ref<string> | string) {
  const repo = usePurifierRepository()
  const purifierId = computed(() => (typeof id === 'string' ? id : id.value))

  return useQuery({
    queryKey: computed(() => purifierQueryKeys.detail(purifierId.value)),
    queryFn: () => repo.getById(purifierId.value),
    enabled: computed(() => Boolean(purifierId.value))
  })
}

export function usePurifierMutations() {
  const repo = usePurifierRepository()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()
  const toast = useAppToast()

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: purifierQueryKeys.list })
  }

  const createMutation = useMutation({
    mutationFn: (input: PurifierCreateInput) => repo.create(input),
    onSuccess: () => {
      invalidateList()
      toast.success('Đã thêm máy lọc mới.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể thêm máy lọc.'))
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: PurifierUpdateInput }) => repo.update(id, input),
    onSuccess: (_data, variables) => {
      invalidateList()
      queryClient.invalidateQueries({ queryKey: purifierQueryKeys.detail(variables.id) })
      toast.success('Đã cập nhật máy lọc.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể cập nhật máy lọc.'))
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => repo.remove(id),
    onSuccess: () => {
      invalidateList()
      toast.success('Đã xóa máy lọc.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể xóa máy lọc.'))
    }
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation
  }
}
