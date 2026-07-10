import type { AxiosError } from 'axios'
import type { ApiErrorPayload } from '~/types/api'

function extractValidationMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  const payload = data as { detail?: unknown; message?: string }

  if (typeof payload.message === 'string' && payload.message.length > 0) {
    return payload.message
  }

  if (typeof payload.detail === 'string') {
    return payload.detail
  }

  if (Array.isArray(payload.detail) && payload.detail.length > 0) {
    const first = payload.detail[0]
    if (first && typeof first === 'object' && 'msg' in first) {
      return String((first as { msg: string }).msg)
    }
  }

  return undefined
}

export function mapAxiosError(error: AxiosError): ApiErrorPayload {
  const statusCode = error.response?.status ?? 0

  if (error.code === 'ECONNABORTED') {
    return { statusCode, message: 'Yêu cầu quá thời gian. Vui lòng thử lại.' }
  }

  if (!error.response) {
    return { statusCode: 0, message: 'Không thể kết nối đến máy chủ.' }
  }

  const validationMessage = extractValidationMessage(error.response.data)
  if (validationMessage) {
    return {
      statusCode,
      message: validationMessage,
      details: error.response.data
    }
  }

  const fallbackByStatus: Record<number, string> = {
    401: 'Email hoặc mật khẩu không đúng.',
    403: 'Bạn không có quyền truy cập.',
    404: 'Không tìm thấy tài nguyên.',
    422: 'Dữ liệu không hợp lệ.',
    500: 'Hệ thống đang bận, vui lòng thử lại.'
  }

  return {
    statusCode,
    message: fallbackByStatus[statusCode] ?? 'Đã xảy ra lỗi không xác định.',
    details: error.response.data
  }
}
