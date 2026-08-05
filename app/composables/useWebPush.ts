import { usePushRepository } from '~/repositories/push.repository'
import { useAppToast } from '~/composables/useAppToast'
import { useApiError } from '~/composables/useApiError'

const PUSH_ENDPOINT_STORAGE_KEY = 'wp.push.endpoint'
const PUSH_TOAST_SESSION_KEY = 'wp.push.subscribedToast'
const SW_READY_TIMEOUT_MS = 12_000
const SUBSCRIBE_RETRY_DELAY_MS = 800

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const bytes = new Uint8Array(raw.length)
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index)
  }
  return bytes
}

function arrayBufferToBase64(value: ArrayBuffer | null): string | null {
  if (!value) {
    return null
  }

  return btoa(String.fromCharCode(...new Uint8Array(value)))
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
  return message.includes('push service') || message.includes('registration failed')
}

async function waitForServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  if (!navigator.serviceWorker.controller) {
    // Lần đầu vào site (hoặc SW mới cài) thường chưa có controller cho tới khi reload /
    // clients.claim. Chờ controllerchange thay vì timeout rồi vẫn subscribe.
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
      // Một số trình duyệt vẫn cho subscribe khi ready + active dù chưa controller.
      // Chỉ bỏ qua nếu registration.active đã có; không thì ném lỗi rõ.
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration?.active) {
        throw error
      }
      console.warn('[web-push] No SW controller yet; continuing with active worker.', error)
      return registration
    }
  }

  const registration = await navigator.serviceWorker.ready

  if (!registration.active) {
    throw new Error('Service Worker chưa sẵn sàng. Hãy tải lại trang rồi thử lại.')
  }

  return registration
}

async function subscribePush(
  registration: ServiceWorkerRegistration,
  applicationServerKey: BufferSource
): Promise<PushSubscription> {
  try {
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    })
  } catch (error) {
    if (!isPushServiceError(error)) {
      throw error
    }

    // Android/Chrome đôi khi lỗi FCM tạm thời sau unsubscribe hoặc SW vừa claim.
    await delay(SUBSCRIBE_RETRY_DELAY_MS)
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    })
  }
}

function getErrorMessage(error: unknown): string {
  if (isPushServiceError(error)) {
    return 'Trình duyệt không kết nối được dịch vụ đẩy (FCM). Hãy mở bằng Chrome, kiểm tra mạng/Google Play Services, tải lại trang rồi thử lại.'
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Lỗi không xác định'
}

export function useWebPush() {
  const config = useRuntimeConfig()
  const repository = usePushRepository()
  const toast = useAppToast()
  const { getErrorMessage: getApiErrorMessage } = useApiError()

  function getPushSupportMessage(): string | null {
    if (!import.meta.client) {
      return null
    }
    if (config.public.useMockApi) {
      return 'Mock API đang bật — không đăng ký push thật.'
    }
    if (typeof Notification === 'undefined') {
      return 'Trình duyệt không hỗ trợ Notification API.'
    }
    if (typeof PushManager === 'undefined') {
      return 'Trình duyệt không hỗ trợ Web Push (PushManager).'
    }
    if (!navigator.serviceWorker) {
      return 'Trình duyệt không hỗ trợ Service Worker (cần HTTPS hoặc localhost).'
    }
    if (Notification.permission === 'denied') {
      return 'Bạn đã tắt quyền thông báo. Hãy bật lại trong cài đặt trình duyệt.'
    }
    return null
  }

  async function ensureSubscribed(options?: { interactive?: boolean }): Promise<boolean> {
    const interactive = options?.interactive ?? false

    if (
      config.public.useMockApi ||
      !import.meta.client ||
      typeof Notification === 'undefined' ||
      typeof PushManager === 'undefined' ||
      !navigator.serviceWorker
    ) {
      if (interactive) {
        toast.error(getPushSupportMessage() ?? 'Thiết bị không hỗ trợ thông báo đẩy.')
      }
      return false
    }

    try {
      const permission =
        Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission

      if (permission !== 'granted') {
        if (interactive) {
          toast.error('Bạn cần cho phép thông báo để nhận nhắc thay lõi trên điện thoại.')
        }
        return false
      }

      const registration = await waitForServiceWorkerRegistration()
      const publicKey = await repository.getVapidPublicKey()
      if (!publicKey?.trim()) {
        throw new Error('VAPID public key trống.')
      }

      // Tái dùng subscription hiện có — tránh unsubscribe + subscribe lại mỗi lần
      // (hay gây "push service error" trên Chrome Android).
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        subscription = await subscribePush(registration, urlBase64ToUint8Array(publicKey.trim()))
      }

      const p256dh = arrayBufferToBase64(subscription.getKey('p256dh'))
      const auth = arrayBufferToBase64(subscription.getKey('auth'))

      if (!p256dh || !auth) {
        throw new Error('Không đọc được khóa push subscription.')
      }

      await repository.subscribe({
        endpoint: subscription.endpoint,
        keys: { p256dh, auth },
        user_agent: navigator.userAgent
      })

      localStorage.setItem(PUSH_ENDPOINT_STORAGE_KEY, subscription.endpoint)

      if (interactive || !sessionStorage.getItem(PUSH_TOAST_SESSION_KEY)) {
        sessionStorage.setItem(PUSH_TOAST_SESSION_KEY, '1')
        toast.success('Đã bật nhắc thay lõi trên thiết bị này.')
      }
      return true
    } catch (error) {
      console.warn('[web-push] ensureSubscribed failed:', error)
      toast.error(`Không đăng ký được thông báo đẩy: ${getApiErrorMessage(error, getErrorMessage(error))}`)
      return false
    }
  }

  async function unsubscribeCurrent(): Promise<void> {
    if (config.public.useMockApi || !import.meta.client) {
      return
    }

    const endpoint = localStorage.getItem(PUSH_ENDPOINT_STORAGE_KEY)
    try {
      if (endpoint) {
        await repository.unsubscribe(endpoint)
      }
    } finally {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        await subscription?.unsubscribe()
      } catch {
        // Không để lỗi Push API làm gián đoạn luồng đăng xuất.
      } finally {
        localStorage.removeItem(PUSH_ENDPOINT_STORAGE_KEY)
        sessionStorage.removeItem(PUSH_TOAST_SESSION_KEY)
      }
    }
  }

  return {
    ensureSubscribed,
    unsubscribeCurrent,
    getPushSupportMessage
  }
}
