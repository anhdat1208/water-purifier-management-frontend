export type AssistantMessageRole = 'user' | 'assistant'

export interface AssistantMessage {
  id: string
  role: AssistantMessageRole
  content: string
  createdAt: string
}

export interface AssistantConversation {
  id: string
  messages: AssistantMessage[]
  updatedAt: string
}

export interface SendMessageInput {
  message: string
  conversationId?: string
}

export interface SendMessageResult {
  userMessage: AssistantMessage
  assistantMessage: AssistantMessage
  conversationId: string
}

export interface AssistantMessageApi {
  id: string | number
  role: AssistantMessageRole
  content: string
  created_at?: string
  createdAt?: string
}

export interface SendMessageResultApi {
  user_message?: AssistantMessageApi
  userMessage?: AssistantMessageApi
  assistant_message?: AssistantMessageApi
  assistantMessage?: AssistantMessageApi
  conversation_id?: string
  conversationId?: string
}
