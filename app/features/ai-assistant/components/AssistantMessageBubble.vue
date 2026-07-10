<script setup lang="ts">
import { Bot, User } from '@lucide/vue'
import type { AssistantMessage } from '~/features/ai-assistant/types/assistant'

interface Props {
  message: AssistantMessage
}

defineProps<Props>()

function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatContent(content: string) {
  return content.split('\n')
}
</script>

<template>
  <div
    class="flex gap-3"
    :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
  >
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      :class="message.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'"
    >
      <User v-if="message.role === 'user'" class="h-4 w-4" />
      <Bot v-else class="h-4 w-4" />
    </div>

    <div
      class="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
      :class="
        message.role === 'user'
          ? 'bg-brand-600 text-white'
          : 'border border-slate-200 bg-white text-slate-800 shadow-sm'
      "
    >
      <p v-for="(line, index) in formatContent(message.content)" :key="index" :class="index > 0 ? 'mt-2' : ''">
        {{ line }}
      </p>
      <p
        class="mt-2 text-xs"
        :class="message.role === 'user' ? 'text-brand-100' : 'text-slate-400'"
      >
        {{ formatTime(message.createdAt) }}
      </p>
    </div>
  </div>
</template>
