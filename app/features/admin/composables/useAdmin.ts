import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useApiError } from '~/composables/useApiError'
import { useAppToast } from '~/composables/useAppToast'
import { adminQueryKeys } from '~/features/admin/constants/query-keys'
import type { AdminUserCreateInput, AdminUserUpdateInput } from '~/features/admin/types/admin'
import { useAdminRepository } from '~/repositories/admin.repository'

export function useAdminStats() {
  const repo = useAdminRepository()
  return useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: () => repo.getStats(),
    staleTime: 30_000
  })
}

export function useAdminUserList() {
  const repo = useAdminRepository()
  return useQuery({
    queryKey: adminQueryKeys.users,
    queryFn: () => repo.listUsers(),
    staleTime: 30_000
  })
}

export function useAdminUserMutations() {
  const repo = useAdminRepository()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()
  const toast = useAppToast()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.users })
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats })
  }

  const createMutation = useMutation({
    mutationFn: (input: AdminUserCreateInput) => repo.createUser(input),
    onSuccess: () => {
      invalidate()
      toast.success('Đã thêm người dùng.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể thêm người dùng.'))
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminUserUpdateInput }) => repo.updateUser(id, input),
    onSuccess: () => {
      invalidate()
      toast.success('Đã cập nhật người dùng.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể cập nhật người dùng.'))
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => repo.removeUser(id),
    onSuccess: () => {
      invalidate()
      toast.success('Đã xóa người dùng.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể xóa người dùng.'))
    }
  })

  return { createMutation, updateMutation, deleteMutation }
}

export function useAdminSettings() {
  const repo = useAdminRepository()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()
  const toast = useAppToast()

  const settingsQuery = useQuery({
    queryKey: adminQueryKeys.settings,
    queryFn: () => repo.getSettings(),
    staleTime: 60_000
  })

  const updateMutation = useMutation({
    mutationFn: repo.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(adminQueryKeys.settings, data)
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats })
      toast.success('Đã lưu cài đặt hệ thống.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể lưu cài đặt.'))
    }
  })

  return {
    settingsQuery,
    updateMutation
  }
}
