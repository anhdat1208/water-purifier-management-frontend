import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useApiError } from '~/composables/useApiError'
import { useAppToast } from '~/composables/useAppToast'
import { ASSISTANT_STORAGE_KEYS } from '~/features/ai-assistant/constants/storage-keys'
import { assistantQueryKeys } from '~/features/ai-assistant/constants/query-keys'
import type { AssistantConversation } from '~/features/ai-assistant/types/assistant'
import { useAssistantRepository } from '~/repositories/assistant.repository'

function loadStoredConversation(): AssistantConversation | null {
  if (!import.meta.client) return null
  try {
    const raw = sessionStorage.getItem(ASSISTANT_STORAGE_KEYS.conversation)
    if (!raw) return null
    return JSON.parse(raw) as AssistantConversation
  } catch {
    return null
  }
}

function saveConversation(conversation: AssistantConversation) {
  if (!import.meta.client) return
  sessionStorage.setItem(ASSISTANT_STORAGE_KEYS.conversation, JSON.stringify(conversation))
}

function clearStoredConversation() {
  if (!import.meta.client) return
  sessionStorage.removeItem(ASSISTANT_STORAGE_KEYS.conversation)
}

export function useAssistantChat() {
  const repo = useAssistantRepository()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()
  const toast = useAppToast()

  const conversationId = ref<string | undefined>(loadStoredConversation()?.id)
  const isTyping = ref(false)

  const conversationQuery = useQuery({
    queryKey: computed(() => assistantQueryKeys.conversation(conversationId.value ?? 'current')),
    queryFn: async () => {
      const stored = loadStoredConversation()
      if (stored && stored.messages.length > 1) {
        return stored
      }
      return repo.getConversation(conversationId.value)
    },
    staleTime: 60_000
  })

  const messages = computed(() => conversationQuery.data.value?.messages ?? [])

  watch(
    () => conversationQuery.data.value,
    (conversation) => {
      if (conversation) {
        conversationId.value = conversation.id
        saveConversation(conversation)
      }
    },
    { deep: true }
  )

  const sendMutation = useMutation({
    mutationFn: (message: string) =>
      repo.sendMessage({
        message,
        conversationId: conversationId.value
      }),
    onMutate: async (message) => {
      isTyping.value = true
      const key = assistantQueryKeys.conversation(conversationId.value ?? 'current')
      const optimisticUser = {
        id: `temp-${Date.now()}`,
        role: 'user' as const,
        content: message,
        createdAt: new Date().toISOString()
      }
      queryClient.setQueryData(key, (old: AssistantConversation | undefined) => {
        const base: AssistantConversation = old ?? {
          id: conversationId.value ?? 'current',
          messages: [],
          updatedAt: new Date().toISOString()
        }
        return {
          ...base,
          messages: [...base.messages, optimisticUser],
          updatedAt: new Date().toISOString()
        }
      })
    },
    onSuccess: (result) => {
      conversationId.value = result.conversationId
      queryClient.setQueryData(
        assistantQueryKeys.conversation(result.conversationId),
        (old: AssistantConversation | undefined) => {
          const base: AssistantConversation = old ?? {
            id: result.conversationId,
            messages: [],
            updatedAt: new Date().toISOString()
          }
          const withoutTemp = base.messages.filter((m) => !m.id.startsWith('temp-'))
          const updated: AssistantConversation = {
            ...base,
            id: result.conversationId,
            messages: [...withoutTemp, result.userMessage, result.assistantMessage],
            updatedAt: new Date().toISOString()
          }
          saveConversation(updated)
          return updated
        }
      )
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể gửi tin nhắn.'))
    },
    onSettled: () => {
      isTyping.value = false
    }
  })

  const clearMutation = useMutation({
    mutationFn: () => repo.clearConversation(conversationId.value),
    onSuccess: (conversation) => {
      clearStoredConversation()
      conversationId.value = conversation.id
      queryClient.setQueryData(assistantQueryKeys.conversation(conversation.id), conversation)
      saveConversation(conversation)
      toast.success('Đã xóa cuộc trò chuyện.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể xóa cuộc trò chuyện.'))
    }
  })

  async function sendMessage(message: string) {
    const trimmed = message.trim()
    if (!trimmed || sendMutation.isPending.value) return
    await sendMutation.mutateAsync(trimmed)
  }

  async function clearChat() {
    await clearMutation.mutateAsync()
  }

  return {
    messages,
    isTyping,
    isLoading: conversationQuery.isLoading,
    isError: conversationQuery.isError,
    isSending: computed(() => sendMutation.isPending.value),
    isClearing: computed(() => clearMutation.isPending.value),
    refetch: conversationQuery.refetch,
    sendMessage,
    clearChat
  }
}
