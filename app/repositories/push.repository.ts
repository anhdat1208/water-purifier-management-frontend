import type { ApiResponse } from '~/types/api'

interface PushSubscribePayload {
  token: string
  user_agent?: string
}

export function usePushRepository() {
  const api = useApiClient()

  return {
    async subscribe(payload: PushSubscribePayload): Promise<void> {
      await api.post('/push/subscribe', payload)
    },

    async unsubscribe(token: string): Promise<void> {
      await api.delete('/push/unsubscribe', { data: { token } })
    }
  }
}
