export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'user'
}

export interface AuthTokensApi {
  access_token?: string
  refresh_token?: string
  accessToken?: string
  refreshToken?: string
}

export interface UserProfileApi {
  id: string
  email: string
  full_name?: string
  fullName?: string
  role: 'admin' | 'user'
}
