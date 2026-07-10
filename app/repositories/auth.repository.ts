import type { ApiResponse } from '~/types/api'
import type { AuthTokensApi, UserProfileApi } from '~/types/auth'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

interface ForgotPasswordPayload {
  email: string
}

export function useAuthRepository() {
  const api = useApiClient()

  return {
    login(payload: LoginPayload) {
      return api.post<ApiResponse<AuthTokensApi>>('/auth/login', payload)
    },
    register(payload: RegisterPayload) {
      return api.post<ApiResponse<UserProfileApi>>('/auth/register', payload)
    },
    forgotPassword(payload: ForgotPasswordPayload) {
      return api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', payload)
    },
    me() {
      return api.get<ApiResponse<UserProfileApi>>('/auth/me')
    },
    refresh(refreshToken: string) {
      return api.post<ApiResponse<AuthTokensApi>>('/auth/refresh', { refresh_token: refreshToken })
    }
  }
}
