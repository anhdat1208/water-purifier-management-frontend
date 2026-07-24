<script setup lang="ts">
import { BellRing, CheckCheck, ChevronRight } from '@lucide/vue'
import type { Notification } from '~/features/notifications/types/notification'
import { useNotificationMutations, useNotifications } from '~/features/notifications/composables/useNotifications'
import { useWebPush } from '~/composables/useWebPush'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const page = ref(1)
const enablingPush = ref(false)
const { data, isLoading, isError, isFetching, refetch } = useNotifications(page)
const { markReadMutation, markAllReadMutation } = useNotificationMutations()
const { ensureSubscribed, getPushSupportMessage } = useWebPush()

const notifications = computed(() => data.value?.items ?? [])
const unreadCount = computed(() => data.value?.unreadCount ?? 0)
const totalPages = computed(() => Math.max(1, Math.ceil((data.value?.total ?? 0) / (data.value?.pageSize ?? 20))))
const notificationPermissionDenied = computed(
  () => import.meta.client && typeof Notification !== 'undefined' && Notification.permission === 'denied'
)
const pushSupportMessage = computed(() => (import.meta.client ? getPushSupportMessage() : null))
const browserPermission = computed(() =>
  import.meta.client && typeof Notification !== 'undefined' ? Notification.permission : 'default'
)

async function enablePushNotifications() {
  enablingPush.value = true
  try {
    await ensureSubscribed({ interactive: true })
  } finally {
    enablingPush.value = false
  }
}

function formatRelativeTime(value: string) {
  const date = new Date(value)
  const timestamp = date.getTime()
  if (Number.isNaN(timestamp)) return value

  const differenceInMinutes = Math.floor((Date.now() - timestamp) / 60_000)
  if (differenceInMinutes < 1) return 'Vừa xong'
  if (differenceInMinutes < 60) return `${differenceInMinutes} phút trước`

  const differenceInHours = Math.floor(differenceInMinutes / 60)
  if (differenceInHours < 24) return `${differenceInHours} giờ trước`

  const differenceInDays = Math.floor(differenceInHours / 24)
  if (differenceInDays < 7) return `${differenceInDays} ngày trước`

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function openNotification(notification: Notification) {
  if (!notification.isRead) {
    markReadMutation.mutate(notification.id)
  }

  if (notification.filterId) {
    navigateTo(`/filters/${notification.filterId}`)
  }
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Thông báo</h1>
          <span
            v-if="unreadCount > 0"
            class="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700"
          >
            {{ unreadCount }} chưa đọc
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-500">Theo dõi các nhắc nhở thay lõi lọc của bạn.</p>
      </div>
      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <AppButton class="w-full sm:w-auto" :loading="enablingPush" @click="enablePushNotifications">
          <BellRing class="mr-2 h-4 w-4" />
          Bật thông báo đẩy
        </AppButton>
        <AppButton
          v-if="unreadCount > 0"
          class="w-full sm:w-auto"
          :loading="markAllReadMutation.isPending.value"
          @click="markAllReadMutation.mutate()"
        >
          <CheckCheck class="mr-2 h-4 w-4" />
          Đánh dấu tất cả đã đọc
        </AppButton>
      </div>
    </div>

    <div
      v-if="notificationPermissionDenied || pushSupportMessage"
      class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    >
      <p v-if="notificationPermissionDenied">
        Bạn đã tắt quyền thông báo trên trình duyệt. Hãy bật lại quyền thông báo trong cài đặt trình duyệt để nhận nhắc
        thay lõi.
      </p>
      <p v-else>{{ pushSupportMessage }}</p>
    </div>

    <div
      v-else
      class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
    >
      Banner Android chỉ hiện khi thiết bị đã đăng ký vào
      <code class="rounded bg-white px-1">push_subscriptions</code>.
      Bấm <span class="font-medium">Bật thông báo đẩy</span>
      (quyền hiện tại: <span class="font-medium">{{ browserPermission }}</span>) rồi đợi toast thành công.
    </div>

    <AppCard class="space-y-4">
      <div v-if="isLoading" class="grid gap-3">
        <AppSkeleton v-for="index in 5" :key="index" class="h-24" />
      </div>

      <div v-else-if="isError" class="space-y-4">
        <AppEmpty
          title="Không tải được thông báo"
          description="Vui lòng kiểm tra kết nối API và thử lại."
        />
        <AppButton :loading="isFetching" @click="refetch()">Thử lại</AppButton>
      </div>

      <template v-else>
        <AppEmpty
          v-if="notifications.length === 0"
          title="Chưa có thông báo"
          description="Các nhắc nhở thay lõi lọc sẽ xuất hiện tại đây."
        />

        <ul v-else class="divide-y divide-slate-100">
          <li v-for="notification in notifications" :key="notification.id">
            <button
              type="button"
              class="flex w-full items-start gap-3 px-1 py-4 text-left transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              :class="{ 'cursor-pointer': notification.filterId }"
              @click="openNotification(notification)"
            >
              <span
                class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
                :class="notification.isRead ? 'bg-transparent' : 'bg-brand-500'"
                aria-hidden="true"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <p class="font-medium text-slate-900">{{ notification.title }}</p>
                  <time class="shrink-0 text-xs text-slate-400">{{ formatRelativeTime(notification.sentAt) }}</time>
                </div>
                <p class="mt-1 text-sm text-slate-500">{{ notification.body }}</p>
              </div>
              <ChevronRight
                v-if="notification.filterId"
                class="mt-1 h-4 w-4 shrink-0 text-slate-400"
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>

        <div v-if="notifications.length > 0" class="flex justify-end">
          <AppPagination :page="page" :total-pages="totalPages" @change="page = $event" />
        </div>
      </template>
    </AppCard>
  </section>
</template>
