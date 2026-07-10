export interface ApiErrorPayload {
  statusCode: number
  message: string
  details?: unknown
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
