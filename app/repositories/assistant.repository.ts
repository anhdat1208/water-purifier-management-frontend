import {
  clearMockConversation,
  getMockConversation,
  sendMockMessage
} from '~/features/ai-assistant/services/assistant-mock.service'
import type {
  AssistantConversation,
  SendMessageInput,
  SendMessageResult
} from '~/features/ai-assistant/types/assistant'
import type { ApiResponse } from '~/types/api'
import { mapSendMessageResult, toSendMessagePayload } from '~/services/assistant-mapper.service'
import type { SendMessageResultApi } from '~/features/ai-assistant/types/assistant'

interface ConversationApi {
  id: string
  messages: Array<{
    id: string | number
    role: 'user' | 'assistant'
    content: string
    created_at?: string
    createdAt?: string
  }>
  updated_at?: string
  updatedAt?: string
}

export function useAssistantRepository() {
  const api = useApiClient()
  const config = useRuntimeConfig()

  async function getConversation(conversationId?: string): Promise<AssistantConversation> {
    if (config.public.useMockApi) {
      return getMockConversation(conversationId)
    }

    const url = conversationId
      ? `/ai-assistant/conversations/${conversationId}`
      : '/ai-assistant/conversations/current'
    const response = await api.get<ApiResponse<ConversationApi>>(url)
    const data = response.data.data
    return {
      id: data.id,
      messages: data.messages.map((m) => ({
        id: String(m.id),
        role: m.role,
        content: m.content,
        createdAt: m.created_at ?? m.createdAt ?? ''
      })),
      updatedAt: data.updated_at ?? data.updatedAt ?? ''
    }
  }

  return {
    getConversation,

    async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
      if (config.public.useMockApi) {
        return sendMockMessage(input)
      }

      const response = await api.post<ApiResponse<SendMessageResultApi>>(
        '/ai-assistant/chat',
        toSendMessagePayload(input.message, input.conversationId)
      )
      return mapSendMessageResult(response.data.data)
    },

    async clearConversation(conversationId?: string): Promise<AssistantConversation> {
      if (config.public.useMockApi) {
        return clearMockConversation(conversationId)
      }

      const url = conversationId
        ? `/ai-assistant/conversations/${conversationId}`
        : '/ai-assistant/conversations/current'
      await api.delete(url)
      return getConversation()
    }
  }
}
