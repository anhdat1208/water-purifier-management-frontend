### Task 9: Manual end-to-end verification

**Files:** none (ops)

- [ ] **Step 1: Generate VAPID keys**

```bash
npx --yes web-push generate-vapid-keys
```

Đưa vào `.env` / docker env: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`.

- [ ] **Step 2: Chạy stack**

```bash
docker compose up -d --build postgres redis api
# FE: cd src/water-purifier-management-frontend && pnpm dev
# hoặc full compose web
```

- [ ] **Step 3: Seed filter ≤ 30 ngày**

Login user demo → tạo/sửa lõi với `last_replaced_date` sao cho `lifespan_days - days_used <= 30`.

- [ ] **Step 4: Subscribe**

Chrome (localhost OK): login → Allow notifications → kiểm tra DB `push_subscriptions` có row.

- [ ] **Step 5: Trigger job thủ công**

```bash
docker compose exec api python -c "from app.database import SessionLocal; from app.jobs.filter_due_push import run_filter_due_push_job; db=SessionLocal(); print(run_filter_due_push_job(db)); db.close()"
```

Expected: notification OS + row trong `/notifications`.

- [ ] **Step 6: Dedup + replace**

Chạy lại job cùng ngày → không thêm row. Gọi replace filter → ngày hôm sau (hoặc `today` giả lập) không còn due nếu remaining > 30.

- [ ] **Step 7: Tắt flag**

Admin settings `auto_notify_filter_due=false` → job `skipped_flag` / created=0.

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| Web Push VAPID PWA | 3, 5, 6, 7 |
| `remaining_days <= 30` daily | 1, 5 |
| Owner only | 5 (user_id), 3–4 auth |
| In-app `/notifications` + nav | 4, 8 |
| Dedup 1/filter/day | 2 unique + 5 |
| History without subscription | 5 case 5 |
| 410 → delete subscription | 5 |
| `auto_notify_filter_due` | 5 |
| No email / no FCM / no multi-threshold | respected (out of scope) |
| Env VAPID + job hour | 3, 5, 9 |

No TBD placeholders. Types: `sent_date` Date used consistently for unique constraint; FE camelCase mappers in Task 8.
