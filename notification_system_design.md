# Stage 1

## Priority Inbox Design

The Stage 1 frontend-track solution introduces a Priority Inbox that always surfaces the top `n` most important unread notifications first. The implementation is placed in `notification_app_fe` using Next.js with TypeScript so the protected notification API can be accessed safely on the server while the user interface stays in React.

## Ranking logic

- `Placement` notifications have the highest priority.
- `Result` notifications come next.
- `Event` notifications have the lowest priority.
- If two notifications belong to the same type, the newer timestamp wins.

## Unread handling

The sample payload shown in the assignment screenshots does not include a read flag. Because of that, the current implementation treats every notification as unread unless an upstream `isRead` or `read` field is present. If those fields appear later, read items are automatically excluded before ranking.

## Efficient top N maintenance

To maintain the top `n` notifications efficiently while new notifications keep arriving, the app uses a fixed-size min-heap.

1. Read each notification from the feed once.
2. Convert it into a comparable priority score using type weight and timestamp.
3. Keep only the best `n` notifications in the heap.
4. When a stronger notification arrives, replace the weakest heap item.

This gives a time complexity of `O(m log n)` for `m` incoming notifications, which is more efficient than sorting the full list every time when `n` is small and fixed.

## Why Next.js fits the frontend track

The frontend instructions require React or Next. Next.js is a better fit here because the notification API is protected. The app uses a server-side route handler to fetch the external feed using environment variables, so credentials are never exposed in browser code.

## Stage 1 implementation summary

- `src/app/api/priority-inbox/route.ts` exposes a server route for the UI.
- `src/lib/notifications/upstream.ts` handles the protected upstream fetch.
- `src/lib/notifications/rank.ts` applies the heap-based ranking logic.
- `src/components/priority-inbox-dashboard.tsx` renders the frontend output for screenshots and later-stage extension.
