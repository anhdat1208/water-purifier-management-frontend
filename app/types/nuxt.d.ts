import type { AxiosInstance } from 'axios'

declare module '#app' {
  interface NuxtApp {
    $apiClient: AxiosInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $apiClient: AxiosInstance
  }
}

export {}
