export const filterQueryKeys = {
  all: ['filters'] as const,
  list: ['filters', 'list'] as const,
  detail: (id: string) => ['filters', 'detail', id] as const
}
