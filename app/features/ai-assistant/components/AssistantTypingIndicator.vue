<script setup lang="ts">
import { Bot } from '@lucide/vue'
</script>

<template>
  <div class="flex gap-3">
    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
      <Bot class="h-4 w-4" />
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
        <span class="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
        <span class="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
      </div>
    </div>
  </div>
</template>
