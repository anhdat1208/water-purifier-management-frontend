import type { AuthTokens, AuthTokensApi, UserProfile, UserProfileApi } from '~/types/auth'

export function mapAuthTokens(data: AuthTokensApi): AuthTokens {
  const accessToken = data.access_token ?? data.accessToken
  const refreshToken = data.refresh_token ?? data.refreshToken

  if (!accessToken || !refreshToken) {
    throw new Error('Phan hoi dang nhap khong hop le.')
  }

  return { accessToken, refreshToken }
}

export function mapUserProfile(data: UserProfileApi): UserProfile {
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name ?? data.fullName ?? '',
    role: data.role
  }
}
