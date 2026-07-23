import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useApiError } from '~/composables/useApiError'
import { useAppToast } from '~/composables/useAppToast'
import { authQueryKeys } from '~/features/auth/constants/query-keys'
import { useAuthRepository } from '~/repositories/auth.repository'
import { mapAuthTokens, mapUserProfile } from '~/services/auth-mapper.service'
import { useAuthStore } from '~/stores/auth.store'
import { useUserStore } from '~/stores/user.store'

export function useAuth() {
  const repo = useAuthRepository()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()
  const toast = useAppToast()

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await repo.login(payload)
      return mapAuthTokens(response.data.data)
    },
    onSuccess: async (tokens) => {
      authStore.setAuthenticated(tokens)
      try {
        const meResponse = await repo.me()
        userStore.setCurrentUser(mapUserProfile(meResponse.data.data))
      } catch {
        // Token đã lưu — không logout; dashboard/useCurrentUser sẽ retry /me.
        toast.error('Đăng nhập OK nhưng chưa tải được hồ sơ. Đang thử lại…')
      }
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me })
      toast.success('Đăng nhập thành công.')
      await navigateTo('/dashboard')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Đăng nhập thất bại.'))
    }
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string; fullName: string }) => {
      const response = await repo.register({
        email: payload.email,
        password: payload.password,
        full_name: payload.fullName
      })
      return mapUserProfile(response.data.data)
    },
    onSuccess: () => {
      toast.success('Đăng ký thành công. Vui lòng đăng nhập.')
      navigateTo('/login')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Đăng ký thất bại.'))
    }
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await repo.forgotPassword(payload)
      return response.data.message ?? 'Đã gửi liên kết đặt lại mật khẩu.'
    },
    onSuccess: (message) => {
      toast.success(message)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể gửi email đặt lại mật khẩu.'))
    }
  })

  async function logout() {
    authStore.logout()
    userStore.setCurrentUser(null)
    queryClient.removeQueries({ queryKey: authQueryKeys.me })
    await navigateTo('/login')
  }

  return {
    loginMutation,
    registerMutation,
    forgotPasswordMutation,
    logout
  }
}

export function useCurrentUser() {
  const repo = useAuthRepository()
  const authStore = useAuthStore()
  const userStore = useUserStore()

  const query = useQuery({
    queryKey: authQueryKeys.me,
    queryFn: async () => {
      const response = await repo.me()
      return mapUserProfile(response.data.data)
    },
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 5 * 60 * 1000
  })

  watch(
    () => query.data.value,
    (user) => {
      if (user) {
        userStore.setCurrentUser(user)
      }
    },
    { immediate: true }
  )

  return query
}
