import { authTokenService } from '~/services/auth-token.service'

export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig()
  if (config.public.useMockApi) {
    return navigateTo('/dashboard')
  }

  const hasToken = Boolean(authTokenService.getAccessToken())
  if (hasToken) {
    return navigateTo('/dashboard')
  }
})
