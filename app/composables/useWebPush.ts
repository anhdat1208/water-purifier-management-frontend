import { usePushRepository } from '~/repositories/push.repository'

const PUSH_ENDPOINT_STORAGE_KEY = 'wp.push.endpoint'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const bytes = Uint8Array.from([...raw].map((character) => character.charCodeAt(0)))
  const buffer = new ArrayBuffer(bytes.byteLength)

  new Uint8Array(buffer).set(bytes)
  return buffer
}

function arrayBufferToBase64(value: ArrayBuffer | null): string | null {
  if (!value) {
    return null
  }

  return btoa(String.fromCharCode(...new Uint8Array(value)))
}

export function useWebPush() {
  const config = useRuntimeConfig()
  const repository = usePushRepository()

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

      const registration = await navigator.serviceWorker.ready
      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        const publicKey = await repository.getVapidPublicKey()
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        })
      }

      const p256dh = arrayBufferToBase64(subscription.getKey('p256dh'))
      const auth = arrayBufferToBase64(subscription.getKey('auth'))

      if (!p256dh || !auth) {
        return
      }

      localStorage.setItem(PUSH_ENDPOINT_STORAGE_KEY, subscription.endpoint)
      await repository.subscribe({
        endpoint: subscription.endpoint,
        keys: { p256dh, auth },
        user_agent: navigator.userAgent
      })
    } catch {
      // Không để lỗi Push API làm gián đoạn luồng đăng nhập.
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
      }
    }
  }

  return {
    ensureSubscribed,
    unsubscribeCurrent
  }
}
