// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'static'
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/eslint'],
  css: ['~/assets/css/main.css', 'vue-toastification/dist/index.css'],
  components: [
    '~/components',
    { path: '~/features', pattern: '**/components/**', pathPrefix: false }
  ],
  imports: {
    dirs: ['composables', 'features/**/composables']
  },
  app: {
    head: {
      title: 'Water Purifier Management',
      htmlAttrs: { lang: 'vi' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Hệ thống quản lý máy lọc nước — theo dõi thiết bị, lõi lọc và bảo trì.'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1',
      requestTimeoutMs: Number(process.env.NUXT_PUBLIC_REQUEST_TIMEOUT_MS ?? 15000),
      useMockApi: process.env.NUXT_PUBLIC_USE_MOCK_API === 'true'
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  eslint: {
    config: {
      standalone: false
    }
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/echarts') || id.includes('node_modules/vue-echarts')) {
              return 'vendor-charts'
            }
            if (id.includes('node_modules/@tanstack')) {
              return 'vendor-query'
            }
            if (id.includes('node_modules/@lucide')) {
              return 'vendor-icons'
            }
          }
        }
      }
    }
  }
})
