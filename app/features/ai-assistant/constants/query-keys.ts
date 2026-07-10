export const assistantQueryKeys = {
  all: ['ai-assistant'] as const,
  conversation: (id: string) => ['ai-assistant', 'conversation', id] as const
}
