import type {
  Notification,
  NotificationApi,
  NotificationList,
  NotificationListApi
} from '~/features/notifications/types/notification'
import type { ApiResponse } from '~/types/api'

function mapNotification(item: NotificationApi): Notification {
  return {
    id: String(item.id),
    filterId: String(item.filter_id),
    purifierId: item.purifier_id === null ? null : String(item.purifier_id),
    type: item.type,
    title: item.title,
    body: item.body,
    remainingDays: item.remaining_days,
    isRead: item.is_read,
    sentAt: item.sent_at
  }
}

function mapNotificationList(data: NotificationListApi): NotificationList {
  return {
    items: data.items.map(mapNotification),
    total: data.total,
    page: data.page,
    pageSize: data.page_size,
    unreadCount: data.unread_count
  }
}

export function useNotificationRepository() {
  const api = useApiClient()

  return {
    async list(page = 1, pageSize = 20): Promise<NotificationList> {
      const response = await api.get<ApiResponse<NotificationListApi>>('/notifications', {
        params: { page, page_size: pageSize }
      })
      return mapNotificationList(response.data.data)
    },

    async markRead(id: string): Promise<Notification> {
      const response = await api.patch<ApiResponse<NotificationApi>>(`/notifications/${id}/read`)
      return mapNotification(response.data.data)
    },

    async markAllRead(): Promise<void> {
      await api.post('/notifications/read-all')
    }
  }
}
