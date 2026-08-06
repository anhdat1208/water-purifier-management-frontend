import type { AxiosInstance } from 'axios'

type RefreshResult =
  | { status: 'ok'; accessToken: string }
  | { status: 'unauthorized' }
  | { status: 'transient' }

declare module '#app' {
  interface NuxtApp {
    $apiClient: AxiosInstance
    $refreshAccessToken: () => Promise<RefreshResult>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $apiClient: AxiosInstance
    $refreshAccessToken: () => Promise<RefreshResult>
  }
}

export {}
