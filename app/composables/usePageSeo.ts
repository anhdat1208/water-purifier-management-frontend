import { APP_NAME, resolvePageMeta } from '~/constants/page-meta'

export function usePageSeo(customTitle?: string, customDescription?: string) {
  const route = useRoute()

  const meta = computed(() => {
    if (customTitle) {
      return {
        title: customTitle,
        description: customDescription ?? ''
      }
    }
    return resolvePageMeta(route.path)
  })

  useHead(() => {
    const entry = meta.value
    const title = entry?.title ? `${entry.title} | ${APP_NAME}` : APP_NAME
    return {
      title,
      meta: entry?.description
        ? [{ name: 'description', content: entry.description }]
        : []
    }
  })
}
