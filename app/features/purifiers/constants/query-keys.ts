export const purifierQueryKeys = {
  all: ['purifiers'] as const,
  list: ['purifiers', 'list'] as const,
  detail: (id: string) => ['purifiers', 'detail', id] as const
}
