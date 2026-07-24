import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useApiError } from '~/composables/useApiError'
import { useAppToast } from '~/composables/useAppToast'
import { useNotificationRepository } from '~/repositories/notification.repository'

const notificationQueryKeys = {
  all: ['notifications'] as const,
  list: (page: number) => ['notifications', 'list', page] as const
}

export function useNotifications(page: Ref<number>) {
  const repo = useNotificationRepository()

  return useQuery({
    queryKey: computed(() => notificationQueryKeys.list(page.value)),
    queryFn: () => repo.list(page.value),
    staleTime: 30_000
  })
}

export function useNotificationMutations() {
  const repo = useNotificationRepository()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()
  const toast = useAppToast()

  function invalidateNotifications() {
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
  }

  const markReadMutation = useMutation({
    mutationFn: (id: string) => repo.markRead(id),
    onSuccess: invalidateNotifications,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể đánh dấu thông báo đã đọc.'))
    }
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => repo.markAllRead(),
    onSuccess: () => {
      invalidateNotifications()
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể đánh dấu tất cả thông báo đã đọc.'))
    }
  })

  return {
    markReadMutation,
    markAllReadMutation
  }
}
