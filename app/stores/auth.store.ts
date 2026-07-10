import { defineStore } from 'pinia'
import { authTokenService } from '~/services/auth-token.service'
import type { AuthTokens } from '~/types/auth'

interface AuthState {
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: Boolean(authTokenService.getAccessToken())
  }),
  actions: {
    setAuthenticated(tokens: AuthTokens) {
      authTokenService.setTokens(tokens)
      this.isAuthenticated = true
    },
    logout() {
      authTokenService.clearTokens()
      this.isAuthenticated = false
    }
  }
})
