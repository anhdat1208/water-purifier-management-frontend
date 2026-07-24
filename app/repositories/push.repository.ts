import type { ApiResponse } from '~/types/api'

interface PushSubscriptionPayload {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  user_agent?: string
}

export function usePushRepository() {
  const api = useApiClient()

  return {
    async getVapidPublicKey(): Promise<string> {
      const response = await api.get<ApiResponse<{ public_key: string }>>('/push/vapid-public-key')
      return response.data.data.public_key
    },

    async subscribe(payload: PushSubscriptionPayload): Promise<void> {
      await api.post('/push/subscribe', payload)
    },

    async unsubscribe(endpoint: string): Promise<void> {
      await api.delete('/push/unsubscribe', { data: { endpoint } })
    }
  }
}
