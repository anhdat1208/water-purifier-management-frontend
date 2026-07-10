import { mapUserProfile } from '~/services/auth-mapper.service'
import { useAuthRepository } from '~/repositories/auth.repository'
import { useAuthStore } from '~/stores/auth.store'
import { useUserStore } from '~/stores/user.store'

export default defineNuxtPlugin(async () => {
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
  } catch {
    authStore.logout()
    userStore.setCurrentUser(null)
  }
})
