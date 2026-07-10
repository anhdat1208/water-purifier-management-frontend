import type { AssistantMessage, AssistantMessageApi, SendMessageResult, SendMessageResultApi } from '~/features/ai-assistant/types/assistant'

export function mapAssistantMessage(data: AssistantMessageApi): AssistantMessage {
  return {
    id: String(data.id),
    role: data.role,
    content: data.content,
    createdAt: data.created_at ?? data.createdAt ?? new Date().toISOString()
  }
}

export function mapSendMessageResult(data: SendMessageResultApi): SendMessageResult {
  const userRaw = data.user_message ?? data.userMessage
  const assistantRaw = data.assistant_message ?? data.assistantMessage

  if (!userRaw || !assistantRaw) {
    throw new Error('Phản hồi AI không hợp lệ.')
  }

  return {
    userMessage: mapAssistantMessage(userRaw),
    assistantMessage: mapAssistantMessage(assistantRaw),
    conversationId: data.conversation_id ?? data.conversationId ?? ''
  }
}

export function toSendMessagePayload(message: string, conversationId?: string) {
  return {
    message,
    ...(conversationId && { conversation_id: conversationId })
  }
}
