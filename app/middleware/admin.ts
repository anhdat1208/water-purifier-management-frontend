import { mapUserProfile } from '~/services/auth-mapper.service'
import { useAuthRepository } from '~/repositories/auth.repository'
import { authTokenService } from '~/services/auth-token.service'
import { useUserStore } from '~/stores/user.store'

export default defineNuxtRouteMiddleware(async () => {
  const config = useRuntimeConfig()
  if (config.public.useMockApi) {
    return
  }

  const userStore = useUserStore()
  if (!authTokenService.getAccessToken()) {
    return navigateTo('/login')
  }

  if (!userStore.currentUser) {
    const repo = useAuthRepository()
    try {
      const response = await repo.me()
      userStore.setCurrentUser(mapUserProfile(response.data.data))
    } catch {
      return navigateTo('/login')
    }
  }

  if (userStore.currentUser?.role !== 'admin') {
    return navigateTo('/dashboard')
  }
})
