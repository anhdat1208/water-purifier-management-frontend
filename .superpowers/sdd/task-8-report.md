# Task 8 Report: Notifications Page + Enable Nav

## Implemented

- Added notification API types and a repository that maps the API's snake_case response to frontend camelCase data.
- Added vue-query list and mutation composables for loading notifications, marking one as read, and marking all as read.
- Added `/notifications` with loading, error, empty, unread, browser-permission, and paginated-list states.
- Enabled the “Thông báo” navigation item.

## Verification

- `pnpm typecheck` completed successfully.

## Notes

- The frontend has no configured test runner, so no automated UI or composable tests were added for this task.
