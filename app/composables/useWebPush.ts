import { usePushRepository } from '~/repositories/push.repository'
import { useAppToast } from '~/composables/useAppToast'
import { useApiError } from '~/composables/useApiError'

const PUSH_ENDPOINT_STORAGE_KEY = 'wp.push.endpoint'
const PUSH_TOAST_SESSION_KEY = 'wp.push.subscribedToast'

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

async function waitForServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.ready

  if (navigator.serviceWorker.controller) {
    return registration
  }

  await Promise.race([
    new Promise<void>((resolve) => {
      navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })
    }),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, 4000)
    })
  ])

  return navigator.serviceWorker.ready
}

function getErrorMessage(error: unknown): string {
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

  async function ensureSubscribed(): Promise<void> {
    if (
      config.public.useMockApi ||
      !import.meta.client ||
      typeof Notification === 'undefined' ||
      typeof PushManager === 'undefined' ||
      !navigator.serviceWorker
    ) {
      return
    }

    try {
      const permission =
        Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission

      if (permission !== 'granted') {
        return
      }

      const registration = await waitForServiceWorkerRegistration()
      const publicKey = await repository.getVapidPublicKey()
      if (!publicKey?.trim()) {
        throw new Error('VAPID public key trống.')
      }

      // Hủy subscription cũ (có thể gắn VAPID khác) rồi đăng ký lại để khớp key hiện tại.
      const existing = await registration.pushManager.getSubscription()
      if (existing) {
        await existing.unsubscribe()
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey.trim())
      })

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

      if (!sessionStorage.getItem(PUSH_TOAST_SESSION_KEY)) {
        sessionStorage.setItem(PUSH_TOAST_SESSION_KEY, '1')
        toast.success('Đã bật nhắc thay lõi trên thiết bị này.')
      }
    } catch (error) {
      console.warn('[web-push] ensureSubscribed failed:', error)
      toast.error(`Không đăng ký được thông báo đẩy: ${getApiErrorMessage(error, getErrorMessage(error))}`)
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
    unsubscribeCurrent
  }
}
