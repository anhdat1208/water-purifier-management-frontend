// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'static'
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/eslint', '@vite-pwa/nuxt'],
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
        },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', href: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { rel: 'apple-touch-icon', href: '/icons/pwa-192x192.png', sizes: '192x192' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1',
      // Vercel serverless cold start có thể >15s; 30s giảm login/F5 timeout ảo.
      requestTimeoutMs: Number(process.env.NUXT_PUBLIC_REQUEST_TIMEOUT_MS ?? 30000),
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
  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    includeAssets: ['icons/pwa-192x192.png', 'icons/pwa-512x512.png'],
    manifest: {
      name: 'Water Purifier Management',
      short_name: 'Water Purifier',
      description: 'Hệ thống quản lý máy lọc nước — theo dõi thiết bị, lõi lọc và bảo trì.',
      lang: 'vi',
      display: 'standalone',
      start_url: '/',
      theme_color: '#2563eb',
      background_color: '#f8fafc',
      icons: [
        {
          src: '/icons/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2,webp}']
    },
    client: {
      installPrompt: false
    },
    devOptions: {
      enabled: false
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
