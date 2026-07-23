interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const canInstall = ref(false)
let listening = false

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    'standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return mq || iosStandalone
}

export function usePwaInstall() {
  if (import.meta.client && !listening) {
    listening = true

    if (isStandaloneDisplay()) {
      canInstall.value = false
      deferredPrompt.value = null
    }

    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault()
      deferredPrompt.value = event as BeforeInstallPromptEvent
      canInstall.value = !isStandaloneDisplay()
    })

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
      canInstall.value = false
    })
  }

  async function install(): Promise<boolean> {
    const promptEvent = deferredPrompt.value
    if (!promptEvent) return false

    await promptEvent.prompt()
    const choice = await promptEvent.userChoice
    deferredPrompt.value = null
    canInstall.value = false
    return choice.outcome === 'accepted'
  }

  return {
    canInstall,
    install
  }
}
