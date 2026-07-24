### Task 7: Service worker push handlers

**Files:**
- Create: `src/water-purifier-management-frontend/public/push-sw.js`
- Modify: `src/water-purifier-management-frontend/nuxt.config.ts`

**Interfaces:**
- Consumes: push payload JSON `{ title, body, data: { url?, filterId? } }`
- Produces: system notification; click → `clients.openWindow(url || '/notifications')`

- [ ] **Step 1: Create `public/push-sw.js`**

```js
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
```

- [ ] **Step 2: Wire importScripts**

In `nuxt.config.ts` `pwa.workbox`:

```ts
workbox: {
  navigateFallback: '/offline',
  globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2,webp}'],
  importScripts: ['/push-sw.js']
},
```

Keep `generateSW`. Ensure `push-sw.js` is not hashed away (public/ is copied as-is).

- [ ] **Step 3: Build check**

```bash
pnpm run build
```

Expected: success; generated SW references `push-sw.js`.

- [ ] **Step 4: Commit (frontend)**

```bash
git commit -m "feat: handle web push events in service worker"
```

---

