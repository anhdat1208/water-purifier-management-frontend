import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false
      },
      mutations: {
        retry: 0
      }
    }
  })

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
