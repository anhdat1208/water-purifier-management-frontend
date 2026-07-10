import { STORAGE_KEYS } from '~/constants/storage-keys'
import type { AuthTokens } from '~/types/auth'

function getStorage() {
  return import.meta.client ? window.localStorage : null
}

export const authTokenService = {
  getAccessToken() {
    return getStorage()?.getItem(STORAGE_KEYS.accessToken) ?? null
  },
  getRefreshToken() {
    return getStorage()?.getItem(STORAGE_KEYS.refreshToken) ?? null
  },
  setTokens(tokens: AuthTokens) {
    const storage = getStorage()
    if (!storage) return
    storage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken)
    storage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken)
  },
  clearTokens() {
    const storage = getStorage()
    if (!storage) return
    storage.removeItem(STORAGE_KEYS.accessToken)
    storage.removeItem(STORAGE_KEYS.refreshToken)
  }
}
