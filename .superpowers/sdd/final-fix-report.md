# Final fix report

- Notification-click handling now awaits `client.navigate(target)` before focusing the client.
- Logout deletes the server subscription when available, then best-effort removes the browser Push API subscription and always clears local storage.
- Verification: `pnpm typecheck` completed successfully.
