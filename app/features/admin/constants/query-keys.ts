export const adminQueryKeys = {
  all: ['admin'] as const,
  stats: ['admin', 'stats'] as const,
  users: ['admin', 'users'] as const,
  userDetail: (id: string) => ['admin', 'users', id] as const,
  settings: ['admin', 'settings'] as const
}
