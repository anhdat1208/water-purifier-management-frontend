<script setup lang="ts">
import { Bot, Trash2 } from '@lucide/vue'
import { useAssistantChat } from '~/features/ai-assistant/composables/useAssistant'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const input = ref('')
const clearOpen = ref(false)

const {
  messages,
  isTyping,
  isLoading,
  isError,
  isSending,
  isClearing,
  refetch,
  sendMessage,
  clearChat
} = useAssistantChat()

const showPrompts = computed(() => messages.value.length <= 1 && !isSending.value)

async function handleSubmit() {
  const text = input.value.trim()
  if (!text) return
  input.value = ''
  await sendMessage(text)
}

function handlePromptSelect(prompt: string) {
  input.value = prompt
  handleSubmit()
}

async function confirmClear() {
  await clearChat()
  clearOpen.value = false
  input.value = ''
}
</script>

<template>
  <section class="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:h-[calc(100vh-6rem)]">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Bot class="h-5 w-5" />
        </div>
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Trợ lý AI</h1>
          <p class="mt-0.5 text-sm text-slate-500">Hỏi đáp về máy lọc, lõi lọc và bảo trì thiết bị.</p>
        </div>
      </div>
      <AppButton
        class="bg-slate-200 text-slate-800 hover:bg-slate-300"
        :loading="isClearing"
        :disabled="isLoading || isSending"
        @click="clearOpen = true"
      >
        <Trash2 class="mr-2 h-4 w-4" />
        Xóa cuộc trò chuyện
      </AppButton>
    </div>

    <AppCard class="flex min-h-0 flex-1 flex-col">
      <div v-if="isError" class="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <AppEmpty
          title="Không tải được trợ lý AI"
          description="Vui lòng kiểm tra kết nối API hoặc bật chế độ demo."
        />
        <AppButton @click="refetch()">Thử lại</AppButton>
      </div>

      <template v-else>
        <AssistantChatWindow
          :messages="messages"
          :is-typing="isTyping"
          :loading="isLoading"
        />

        <div class="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <AssistantSuggestedPrompts
            v-if="showPrompts"
            :disabled="isSending"
            @select="handlePromptSelect"
          />
          <AssistantInputBar
            v-model="input"
            :loading="isSending"
            :disabled="isLoading"
            @submit="handleSubmit"
          />
          <p class="text-center text-xs text-slate-400">
            Enter để gửi · Shift+Enter xuống dòng · Chế độ demo dùng phản hồi mẫu
          </p>
        </div>
      </template>
    </AppCard>

    <AppConfirmDialog
      :open="clearOpen"
      title="Xóa cuộc trò chuyện"
      description="Bạn có chắc muốn xóa toàn bộ tin nhắn? Cuộc trò chuyện sẽ bắt đầu lại từ đầu."
      @cancel="clearOpen = false"
      @confirm="confirmClear"
    />
  </section>
</template>
