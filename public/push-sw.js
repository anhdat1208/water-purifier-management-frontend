/* global self, clients */
self.addEventListener('push', (event) => {
  let payload = { title: 'Nhắc thay lõi lọc', body: '', data: {} }
  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() }
    }
  } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: payload.data || {},
      icon: '/icons/pwa-192x192.png',
      badge: '/icons/pwa-192x192.png'
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/notifications'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(target)
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(target)
      }
    })
  )
})
