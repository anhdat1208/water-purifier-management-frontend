import { mapUserProfile } from '~/services/auth-mapper.service'
import { useWebPush } from '~/composables/useWebPush'
import { useAuthRepository } from '~/repositories/auth.repository'
import { authTokenService } from '~/services/auth-token.service'
import { useAuthStore } from '~/stores/auth.store'
import { useUserStore } from '~/stores/user.store'

function isUnauthorizedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const statusCode = 'statusCode' in error ? Number((error as { statusCode?: number }).statusCode) : NaN
  return statusCode === 401 || statusCode === 403
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const { $refreshAccessToken } = useNuxtApp()

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

  const hasAccess = Boolean(authTokenService.getAccessToken())
  const hasRefresh = Boolean(authTokenService.getRefreshToken())

  // Có refresh trong storage thì coi như còn phiên — kể cả access đã hết hạn.
  if (!hasAccess && !hasRefresh) {
    return
  }

  // Cold start (mở lại hôm sau): chủ động refresh trước /me.
  if (hasRefresh) {
    const refreshResult = await $refreshAccessToken()
    if (refreshResult.status === 'unauthorized') {
      authStore.logout()
      userStore.setCurrentUser(null)
      return
    }
    if (refreshResult.status === 'transient' && !authTokenService.getAccessToken()) {
      // Mạng lỗi và access đã hết — giữ refresh token, không đá login.
      authStore.isAuthenticated = true
      return
    }
  }

  if (!authTokenService.getAccessToken()) {
    return
  }

  authStore.isAuthenticated = true

  const repo = useAuthRepository()

  try {
    const response = await repo.me()
    userStore.setCurrentUser(mapUserProfile(response.data.data))
    void useWebPush().ensureSubscribed()
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      return
    }

    // 401 sau /me: thử refresh thêm một lần; chỉ logout khi refresh xác nhận token chết.
    if (!authTokenService.getRefreshToken()) {
      authStore.logout()
      userStore.setCurrentUser(null)
      return
    }

    const retryRefresh = await $refreshAccessToken()
    if (retryRefresh.status === 'unauthorized') {
      authStore.logout()
      userStore.setCurrentUser(null)
      return
    }
    if (retryRefresh.status === 'transient') {
      return
    }

    try {
      const response = await repo.me()
      userStore.setCurrentUser(mapUserProfile(response.data.data))
      void useWebPush().ensureSubscribed()
    } catch (retryError) {
      if (isUnauthorizedError(retryError)) {
        authStore.logout()
        userStore.setCurrentUser(null)
      }
    }
  }
})
