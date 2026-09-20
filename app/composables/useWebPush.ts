import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { deleteToken, getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging'
import { usePushRepository } from '~/repositories/push.repository'
import { useAppToast } from '~/composables/useAppToast'
import { useApiError } from '~/composables/useApiError'

const PUSH_TOKEN_STORAGE_KEY = 'wp.push.fcmToken'
const PUSH_TOAST_SESSION_KEY = 'wp.push.subscribedToast'
const SW_READY_TIMEOUT_MS = 12_000

export type PushDiagnostic = {
  permission: NotificationPermission | 'unsupported'
  swController: boolean
  swActive: boolean
  swScriptUrl: string | null
  hasBrowserSubscription: boolean
  tokenHint: string | null
  standalone: boolean
  userAgent: string
  lastError: string | null
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function isPushServiceError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }
  const message = error.message.toLowerCase()
  return message.includes('push service') || message.includes('registration failed') || message.includes('messaging')
}

function formatPushError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }
  const name = 'name' in error ? String((error as { name?: string }).name) : 'Error'
  return `${name}: ${error.message}`
}

async function waitForServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  if (!navigator.serviceWorker.controller) {
    try {
      await Promise.race([
        new Promise<void>((resolve) => {
          if (navigator.serviceWorker.controller) {
            resolve()
            return
          }
          navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })
        }),
        new Promise<void>((_, reject) => {
          window.setTimeout(() => {
            reject(
              new Error(
                'Service Worker chưa điều khiển trang. Hãy tải lại trang rồi bật lại thông báo đẩy.'
              )
            )
          }, SW_READY_TIMEOUT_MS)
        })
      ])
    } catch (error) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration?.active) {
        throw error
      }
      console.warn('[fcm] No SW controller yet; continuing with active worker.', error)
      return registration
    }
  }

  const registration = await navigator.serviceWorker.ready

  if (!registration.active) {
    throw new Error('Service Worker chưa sẵn sàng. Hãy tải lại trang rồi thử lại.')
  }

  return registration
}

function getErrorMessage(error: unknown): string {
  if (isPushServiceError(error)) {
    return 'Trình duyệt không kết nối được Firebase Cloud Messaging. Hãy mở bằng Chrome, kiểm tra mạng, tải lại trang rồi thử lại.'
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Lỗi không xác định'
}

function emptyDiagnostic(lastError: string | null = null): PushDiagnostic {
  return {
    permission: 'unsupported',
    swController: false,
    swActive: false,
    swScriptUrl: null,
    hasBrowserSubscription: false,
    tokenHint: null,
    standalone: false,
    userAgent: import.meta.client ? navigator.userAgent : '',
    lastError
  }
}

function getFirebaseConfig(config: ReturnType<typeof useRuntimeConfig>) {
  return {
    apiKey: String(config.public.firebaseApiKey || ''),
    authDomain: String(config.public.firebaseAuthDomain || ''),
    projectId: String(config.public.firebaseProjectId || ''),
    messagingSenderId: String(config.public.firebaseMessagingSenderId || ''),
    appId: String(config.public.firebaseAppId || '')
  }
}

function isFirebaseConfigured(config: ReturnType<typeof useRuntimeConfig>): boolean {
  const firebase = getFirebaseConfig(config)
  return Boolean(
    firebase.apiKey &&
      firebase.authDomain &&
      firebase.projectId &&
      firebase.messagingSenderId &&
      firebase.appId &&
      config.public.firebaseVapidKey
  )
}

function getFirebaseApp(config: ReturnType<typeof useRuntimeConfig>): FirebaseApp {
  const existing = getApps()[0]
  if (existing) {
    return existing
  }
  return initializeApp(getFirebaseConfig(config))
}

function getFirebaseMessaging(config: ReturnType<typeof useRuntimeConfig>): Messaging {
  return getMessaging(getFirebaseApp(config))
}

export function useWebPush() {
  const config = useRuntimeConfig()
  const repository = usePushRepository()
  const toast = useAppToast()
  const { getErrorMessage: getApiErrorMessage } = useApiError()
  const lastDiagnostic = useState<PushDiagnostic | null>('wp.push.diagnostic', () => null)

  function getPushSupportMessage(): string | null {
    if (!import.meta.client) {
      return null
    }
    if (config.public.useMockApi) {
      return 'Mock API đang bật — không đăng ký push thật.'
    }
    if (!isFirebaseConfigured(config)) {
      return 'Firebase Web chưa được cấu hình (NUXT_PUBLIC_FIREBASE_*).'
    }
    if (typeof Notification === 'undefined') {
      return 'Trình duyệt không hỗ trợ Notification API.'
    }
    if (!navigator.serviceWorker) {
      return 'Trình duyệt không hỗ trợ Service Worker (cần HTTPS hoặc localhost).'
    }
    if (Notification.permission === 'denied') {
      return 'Bạn đã tắt quyền thông báo. Hãy bật lại trong cài đặt trình duyệt.'
    }
    return null
  }

  async function collectDiagnostic(lastError: string | null = null): Promise<PushDiagnostic> {
    if (!import.meta.client || typeof Notification === 'undefined' || !navigator.serviceWorker) {
      const diagnostic = emptyDiagnostic(lastError)
      lastDiagnostic.value = diagnostic
      return diagnostic
    }

    const registration = await navigator.serviceWorker.getRegistration()
    const storedToken = localStorage.getItem(PUSH_TOKEN_STORAGE_KEY)
    const displayModeStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && Boolean((navigator as { standalone?: boolean }).standalone))

    const diagnostic: PushDiagnostic = {
      permission: Notification.permission,
      swController: Boolean(navigator.serviceWorker.controller),
      swActive: Boolean(registration?.active),
      swScriptUrl: registration?.active?.scriptURL ?? null,
      hasBrowserSubscription: Boolean(storedToken),
      tokenHint: storedToken ? storedToken.slice(-48) : null,
      standalone: displayModeStandalone,
      userAgent: navigator.userAgent,
      lastError
    }
    lastDiagnostic.value = diagnostic
    console.info('[fcm] diagnostic', diagnostic)
    return diagnostic
  }

  async function ensureSubscribed(options?: { interactive?: boolean }): Promise<boolean> {
    const interactive = options?.interactive ?? false

    if (config.public.useMockApi || !import.meta.client || typeof Notification === 'undefined' || !navigator.serviceWorker) {
      if (interactive) {
        toast.error(getPushSupportMessage() ?? 'Thiết bị không hỗ trợ thông báo đẩy.')
      }
      await collectDiagnostic(getPushSupportMessage())
      return false
    }

    if (!isFirebaseConfigured(config)) {
      if (interactive) {
        toast.error(getPushSupportMessage() ?? 'Firebase chưa cấu hình.')
      }
      await collectDiagnostic(getPushSupportMessage())
      return false
    }

    try {
      const messagingSupported = await isSupported()
      if (!messagingSupported) {
        const message = 'Trình duyệt này không hỗ trợ Firebase Cloud Messaging.'
        if (interactive) {
          toast.error(message)
        }
        await collectDiagnostic(message)
        return false
      }

      const permission =
        Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission

      if (permission !== 'granted') {
        if (interactive) {
          toast.error('Bạn cần cho phép thông báo để nhận nhắc thay lõi trên điện thoại.')
        }
        await collectDiagnostic(`permission=${permission}`)
        return false
      }

      const registration = await waitForServiceWorkerRegistration()
      const messaging = getFirebaseMessaging(config)
      const vapidKey = String(config.public.firebaseVapidKey || '').trim()

      let token: string | null = null
      try {
        token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration
        })
      } catch (error) {
        if (!isPushServiceError(error)) {
          throw error
        }
        await delay(800)
        token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration
        })
      }

      if (!token) {
        throw new Error('Không lấy được FCM registration token.')
      }

      await repository.subscribe({
        token,
        user_agent: navigator.userAgent
      })

      localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token)

      await collectDiagnostic(null)

      if (interactive || !sessionStorage.getItem(PUSH_TOAST_SESSION_KEY)) {
        sessionStorage.setItem(PUSH_TOAST_SESSION_KEY, '1')
        toast.success('Đã bật nhắc thay lõi trên thiết bị này.')
      }
      return true
    } catch (error) {
      console.warn('[fcm] ensureSubscribed failed:', error)
      const diagnostic = await collectDiagnostic(formatPushError(error))
      const detail = getApiErrorMessage(error, getErrorMessage(error))
      toast.error(`Không đăng ký được thông báo đẩy: ${detail}`)
      if (interactive) {
        console.warn('[fcm] fail context', {
          swController: diagnostic.swController,
          swActive: diagnostic.swActive,
          hasBrowserSubscription: diagnostic.hasBrowserSubscription,
          standalone: diagnostic.standalone
        })
      }
      return false
    }
  }

  async function unsubscribeCurrent(): Promise<void> {
    if (config.public.useMockApi || !import.meta.client) {
      return
    }

    const token = localStorage.getItem(PUSH_TOKEN_STORAGE_KEY)
    try {
      if (token) {
        await repository.unsubscribe(token)
      }
    } finally {
      try {
        if (isFirebaseConfigured(config) && (await isSupported())) {
          await deleteToken(getFirebaseMessaging(config))
        }
      } catch {
        // Không để lỗi FCM làm gián đoạn luồng đăng xuất.
      } finally {
        localStorage.removeItem(PUSH_TOKEN_STORAGE_KEY)
        sessionStorage.removeItem(PUSH_TOAST_SESSION_KEY)
        lastDiagnostic.value = null
      }
    }
  }

  return {
    ensureSubscribed,
    unsubscribeCurrent,
    getPushSupportMessage,
    collectDiagnostic,
    lastDiagnostic
  }
}
