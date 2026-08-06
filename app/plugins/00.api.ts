import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { mapAuthTokens } from '~/services/auth-mapper.service'
import { authTokenService } from '~/services/auth-token.service'
import { mapAxiosError } from '~/services/error-mapper.service'
import { useAuthStore } from '~/stores/auth.store'

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

type RefreshResult =
  | { status: 'ok'; accessToken: string }
  | { status: 'unauthorized' }
  | { status: 'transient' }

async function refreshAccessToken(apiClient: AxiosInstance): Promise<RefreshResult> {
  if (isRefreshing && refreshPromise) {
    try {
      const token = await refreshPromise
      return token ? { status: 'ok', accessToken: token } : { status: 'unauthorized' }
    } catch {
      return { status: 'transient' }
    }
  }

  isRefreshing = true
  const refreshToken = authTokenService.getRefreshToken()
  if (!refreshToken) {
    isRefreshing = false
    return { status: 'unauthorized' }
  }

  const authStore = useAuthStore()

  refreshPromise = apiClient
    .post('/auth/refresh', { refresh_token: refreshToken })
    .then((response) => {
      const tokens = mapAuthTokens(response.data.data)
      authStore.setAuthenticated(tokens)
      return tokens.accessToken
    })
    .catch((error: AxiosError) => {
      const status = error.response?.status
      if (status === 401 || status === 403) {
        return null
      }
      // Timeout / mạng / 5xx: giữ session, để lần sau thử lại.
      throw error
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  try {
    const token = await refreshPromise
    return token ? { status: 'ok', accessToken: token } : { status: 'unauthorized' }
  } catch {
    return { status: 'transient' }
  }
}

function attachAccessToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = authTokenService.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

function isAuthRefreshRequest(config?: InternalAxiosRequestConfig): boolean {
  const url = config?.url ?? ''
  return url.includes('/auth/refresh')
}

// File name `00.api.ts` ensures this loads before `auth-init.client.ts`.
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const client = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: config.public.requestTimeoutMs
  })

  client.interceptors.request.use(attachAccessToken)

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthRefreshRequest(originalRequest)
      ) {
        originalRequest._retry = true
        const refreshResult = await refreshAccessToken(client)
        if (refreshResult.status === 'ok') {
          originalRequest.headers.Authorization = `Bearer ${refreshResult.accessToken}`
          return client(originalRequest)
        }
        if (refreshResult.status === 'unauthorized') {
          authStore.logout()
          await navigateTo('/login')
        }
        // transient: giữ token, không đá login vì mạng/timeout.
      }

      return Promise.reject(mapAxiosError(error))
    }
  )

  return {
    provide: {
      apiClient: client,
      refreshAccessToken: () => refreshAccessToken(client)
    }
  }
})
