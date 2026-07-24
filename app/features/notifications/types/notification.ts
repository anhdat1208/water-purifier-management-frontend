export interface Notification {
  id: string
  filterId: string
  purifierId: string | null
  type: string
  title: string
  body: string
  remainingDays: number
  isRead: boolean
  sentAt: string
}

export interface NotificationApi {
  id: number | string
  filter_id: number | string
  purifier_id: number | string | null
  type: string
  title: string
  body: string
  remaining_days: number
  is_read: boolean
  sent_at: string
}

export interface NotificationList {
  items: Notification[]
  total: number
  page: number
  pageSize: number
  unreadCount: number
}

export interface NotificationListApi {
  items: NotificationApi[]
  total: number
  page: number
  page_size: number
  unread_count: number
}
