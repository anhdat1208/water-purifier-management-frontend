# Task 9 Report — Manual E2E verification

**Status:** DONE_WITH_CONCERNS (automated checks OK; full browser/Docker E2E blocked in this environment)

## Automated verification completed

| Check | Result |
|---|---|
| Backend `pytest` | **20 passed** (after installing `apscheduler` + `pywebpush` in local venv) |
| Frontend `pnpm typecheck` | **exit 0** |
| Docker Compose | **Not running** (`docker_engine` pipe missing) |
| VAPID key generation | **Skipped** — requires explicit user approval (secret material) |
| Chrome Android push | **Not run** — needs Docker + VAPID + browser permission |

## Manual steps remaining for you

1. Start Docker Desktop, then from monorepo root:
   ```bash
   docker compose up -d --build postgres redis api
   ```
2. Generate VAPID keys (once):
   ```bash
   npx --yes web-push generate-vapid-keys
   ```
   Put `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` into `.env` (see `.env.example`).
3. Rebuild/restart API so env is picked up.
4. FE: `pnpm dev` in `src/water-purifier-management-frontend`.
5. Login → Allow notifications → confirm `push_subscriptions` row.
6. Seed/edit a filter with `remaining_days <= 30`.
7. Trigger job:
   ```bash
   docker compose exec api python -c "from app.database import SessionLocal; from app.jobs.filter_due_push import run_filter_due_push_job; db=SessionLocal(); print(run_filter_due_push_job(db)); db.close()"
   ```
8. Confirm OS notification + `/notifications` history; re-run same day → no duplicate; replace filter → stops due.

## Branches

- BE: `feat/web-push-filter-reminder` (`c01df8c` → `9dc1edf`)
- FE: `feat/web-push-filter-reminder` (`fa5a527` → `b5e61f3`)
