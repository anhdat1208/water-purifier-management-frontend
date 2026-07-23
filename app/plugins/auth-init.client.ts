import { mapUserProfile } from '~/services/auth-mapper.service'
import { useAuthRepository } from '~/repositories/auth.repository'
import { useAuthStore } from '~/stores/auth.store'
import { useUserStore } from '~/stores/user.store'

function isUnauthorizedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const statusCode = 'statusCode' in error ? Number((error as { statusCode?: number }).statusCode) : NaN
  return statusCode === 401 || statusCode === 403
}

export default defineNuxtPlugin({
  name: 'auth-init',
  dependsOn: ['api'],
  async setup() {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const userStore = useUserStore()

    if (config.public.useMockApi) {
      authStore.setAuthenticated({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      })
      userStore.setCurrentUser({
        id: 'demo-admin',
        email: 'admin@waterpurifier.local',
        fullName: 'Quản trị viên Demo',
        role: 'admin'
      })
      return
    }

    if (!authStore.isAuthenticated) {
      return
    }

    const repo = useAuthRepository()

    try {
      const response = await repo.me()
      userStore.setCurrentUser(mapUserProfile(response.data.data))
    } catch (error) {
      // Chỉ clear session khi auth thật sự fail.
      // Timeout / mạng / cold start: giữ token để trang retry.
      if (isUnauthorizedError(error)) {
        authStore.logout()
        userStore.setCurrentUser(null)
      }
    }
  }
})
