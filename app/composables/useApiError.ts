import type { ApiErrorPayload } from '~/types/api'

export function useApiError() {
  function getErrorMessage(error: unknown, fallback = 'Đã xảy ra lỗi. Vui lòng thử lại.'): string {
    if (!error || typeof error !== 'object') {
      return fallback
    }

    const payload = error as ApiErrorPayload
    if (typeof payload.message === 'string' && payload.message.length > 0) {
      return payload.message
    }

    return fallback
  }

  return { getErrorMessage }
}
