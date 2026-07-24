# Task 6 Report: Frontend Web Push Subscription

## Implemented

- Added `usePushRepository` for the VAPID public-key, subscribe, and unsubscribe API endpoints.
- Added `useWebPush` to request permission, subscribe through the registered service worker, encode subscription keys, and persist the endpoint for logout.
- Wired best-effort subscription after login and authenticated app initialization.
- Wired best-effort unsubscription before clearing the authentication session on logout.

## Verification

- `pnpm typecheck` completed successfully.
- No Vitest suite was added or run, per task instruction.

## Notes

- Subscription setup safely skips mock API mode, unsupported browsers, denied notification permission, and Push API failures so authentication remains usable.
- The current endpoint is removed from local storage even if the unsubscribe API request fails.
