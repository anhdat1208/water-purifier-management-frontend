import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { mapAuthTokens } from '~/services/auth-mapper.service'
import { authTokenService } from '~/services/auth-token.service'
import { mapAxiosError } from '~/services/error-mapper.service'
import { useAuthStore } from '~/stores/auth.store'

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(apiClient: AxiosInstance): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  const refreshToken = authTokenService.getRefreshToken()
  if (!refreshToken) {
    isRefreshing = false
    return null
  }

  refreshPromise = apiClient
    .post('/auth/refresh', { refresh_token: refreshToken })
    .then((response) => {
      const tokens = mapAuthTokens(response.data.data)
      authTokenService.setTokens(tokens)
      return tokens.accessToken
    })
    .catch(() => null)
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
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
        const newAccessToken = await refreshAccessToken(client)
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return client(originalRequest)
        }
        authStore.logout()
        await navigateTo('/login')
      }

      return Promise.reject(mapAxiosError(error))
    }
  )

  return {
    provide: {
      apiClient: client
    }
  }
})
