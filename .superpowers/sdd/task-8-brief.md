### Task 8: Notifications page + enable nav

**Files:**
- Create: `src/water-purifier-management-frontend/app/repositories/notification.repository.ts`
- Create: `src/water-purifier-management-frontend/app/features/notifications/types/notification.ts`
- Create: `src/water-purifier-management-frontend/app/features/notifications/composables/useNotifications.ts`
- Create: `src/water-purifier-management-frontend/app/pages/notifications/index.vue`
- Modify: `src/water-purifier-management-frontend/app/constants/nav-items.ts`

**Interfaces:**
- Page meta: `layout: 'app'`, `middleware: ['auth']`
- List items; unread style; click → mark read + `navigateTo(/filters/{id})` nếu có `filterId`
- Button “Đánh dấu tất cả đã đọc”
- Nếu `Notification.permission === 'denied'`: hint VI bật quyền trình duyệt
- Nav: bỏ `disabled: true` khỏi item Thông báo

- [ ] **Step 1: Types + repository + composable (vue-query)**

Map API snake_case → camelCase (`filter_id` → `filterId`, `is_read` → `isRead`, `sent_at` → `sentAt`, `remaining_days` → `remainingDays`).

- [ ] **Step 2: Page UI**

Giữ style list hiện có (filters/purifiers): header, empty state, loading/error. Không invent card-heavy dashboard. Mỗi row: title, body, relative time, unread indicator.

- [ ] **Step 3: Enable nav**

```ts
{ label: 'Thông báo', to: '/notifications', icon: Bell },
```

- [ ] **Step 4: `pnpm typecheck` + commit**

```bash
git commit -m "feat: add notifications history page"
```

---

