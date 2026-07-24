### Task 6: Frontend push repository + `useWebPush` + auth hooks

**Files:**
- Create: `src/water-purifier-management-frontend/app/repositories/push.repository.ts`
- Create: `src/water-purifier-management-frontend/app/composables/useWebPush.ts`
- Modify: `src/water-purifier-management-frontend/app/features/auth/composables/useAuth.ts`
- Modify: `src/water-purifier-management-frontend/app/plugins/auth-init.client.ts`

**Interfaces:**
- Consumes: `GET /push/vapid-public-key`, `POST /push/subscribe`, `DELETE /push/unsubscribe`
- Produces: `useWebPush().ensureSubscribed(): Promise<void>`, `unsubscribeCurrent(): Promise<void>`
- Behavior:
  - Skip nếu `useMockApi`, thiếu `Notification`/`PushManager`, hoặc permission `denied`.
  - Nếu `default` → `Notification.requestPermission()`.
  - Nếu `granted` → subscribe với VAPID key (urlBase64ToUint8Array) + POST subscribe.
  - Gọi `ensureSubscribed` sau login success và trong `auth-init` khi đã authenticated.
  - Logout: best-effort `unsubscribeCurrent` rồi clear session.

- [ ] **Step 1: Repository**

```ts
export function usePushRepository() {
  const api = useApiClient()
  return {
    async getVapidPublicKey() {
      const res = await api.get<ApiResponse<{ public_key: string }>>('/push/vapid-public-key')
      return res.data.data.public_key
    },
    async subscribe(payload: { endpoint: string; keys: { p256dh: string; auth: string }; user_agent?: string }) {
      await api.post('/push/subscribe', payload)
    },
    async unsubscribe(endpoint: string) {
      await api.delete('/push/unsubscribe', { data: { endpoint } })
    }
  }
}
```

(Nếu axios client không hỗ trợ `delete` body, dùng `api.request({ method:'DELETE', url, data })` theo pattern hiện có trong `useApiClient`.)

- [ ] **Step 2: `useWebPush.ts`**

Implement helper:

```ts
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}
```

Subscribe flow dùng `navigator.serviceWorker.ready` rồi `reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`. Convert keys bằng `btoa(String.fromCharCode(...new Uint8Array(key)))` theo chuẩn.

Lưu `endpoint` gần nhất vào `localStorage` key `wp.push.endpoint` để unsubscribe lúc logout.

- [ ] **Step 3: Wire auth**

Trong `loginMutation.onSuccess` sau `navigateTo` (hoặc trước): `void useWebPush().ensureSubscribed()`.

Trong `logout`: `await useWebPush().unsubscribeCurrent()` trong try/catch rồi clear stores.

Trong `auth-init.client.ts` sau khi `/me` OK: `void useWebPush().ensureSubscribed()`.

- [ ] **Step 4: Verify**

```bash
cd src/water-purifier-management-frontend
pnpm typecheck
```

Expected: no new TS errors.

- [ ] **Step 5: Commit (frontend repo)**

```bash
git commit -m "feat: subscribe web push after login"
```

---

