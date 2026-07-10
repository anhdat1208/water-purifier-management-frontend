<script setup lang="ts">
import type { AssistantMessage } from '~/features/ai-assistant/types/assistant'

interface Props {
  messages: AssistantMessage[]
  isTyping?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isTyping: false,
  loading: false
})

const scrollRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    const el = scrollRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

watch(
  () => [props.messages.length, props.isTyping] as const,
  () => scrollToBottom(),
  { immediate: true }
)
</script>

<template>
  <div
    ref="scrollRef"
    class="flex-1 space-y-4 overflow-y-auto px-1 py-2"
  >
    <div v-if="loading" class="space-y-4">
      <AppSkeleton class="h-20 w-3/4" />
      <AppSkeleton class="ml-auto h-16 w-1/2" />
      <AppSkeleton class="h-24 w-2/3" />
    </div>

    <template v-else>
      <AssistantMessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
      <AssistantTypingIndicator v-if="isTyping" />
    </template>
  </div>
</template>
