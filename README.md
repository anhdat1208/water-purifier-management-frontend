# Water Purifier Management — Frontend

Hệ thống quản lý máy lọc nước (Nuxt 4 SPA), giao tiếp với FastAPI backend qua REST API.

## Tech stack

- Nuxt 4, TypeScript (strict), TailwindCSS
- Pinia, TanStack Query, Axios
- VeeValidate + Zod, VueUse, ECharts (lazy-loaded)
- Lucide Icons, Vue Toastification

## Yêu cầu

- Node.js 22+
- pnpm 10+

## Cài đặt & chạy

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Mở `http://localhost:3000`.

### Chế độ demo (không cần backend)

Trong `.env`:

```env
NUXT_PUBLIC_USE_MOCK_API=true
```

Ứng dụng dùng dữ liệu mẫu, tự đăng nhập với tài khoản admin demo.

### Kết nối API thật

```env
NUXT_PUBLIC_USE_MOCK_API=false
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `pnpm dev` | Chạy development server |
| `pnpm build` | Build production |
| `pnpm preview` | Xem bản build |
| `pnpm lint` | Chạy ESLint |
| `pnpm typecheck` | Kiểm tra TypeScript |

## Cấu trúc chính

```
app/
├── components/       # UI dùng chung (AppButton, AppChart, AppMobileNav...)
├── composables/      # useApiClient, usePageSeo...
├── constants/        # nav-items, page-meta...
├── features/         # auth, dashboard, purifiers, filters, ai-assistant, admin
├── layouts/          # app, auth, default
├── middleware/       # auth, guest, admin
├── pages/            # routes
├── plugins/          # axios, vue-query, auth-init...
├── repositories/     # API layer (mock + real)
├── services/         # mappers, token, error handling
└── stores/           # auth, user, settings (Pinia)
```

## Modules đã hoàn thành

| Phase | Module |
|-------|--------|
| 1–2 | Foundation, kiến trúc, API layer |
| 3 | Auth (login, register, forgot-password) |
| 4 | Dashboard + ECharts |
| 5 | Máy lọc nước (Purifiers) |
| 6 | Lõi lọc (Filters) |
| 7 | Trợ lý AI |
| 8 | Quản trị (Admin) |
| 9 | Tối ưu (bundle split, lazy charts, debounce, mobile nav, SEO) |

## Tối ưu (Phase 9)

- **Lazy ECharts** — biểu đồ chỉ tải khi vào Dashboard
- **Code splitting** — tách vendor chunks (charts, query, icons)
- **Debounced search** — danh sách máy lọc, lõi lọc, người dùng
- **Mobile navigation** — menu drawer trên màn hình nhỏ
- **SEO** — title/description động theo route
- **Vue Query** — `gcTime` 5 phút, tắt refetch on focus

## Backend (repo riêng)

`water-purifier-management-backend` — FastAPI, PostgreSQL, JWT. Xem các file `repositories/*.ts` để biết API contract cần implement.
