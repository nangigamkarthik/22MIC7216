## Notifications Frontend

This app contains the frontend submission in a single project folder. It now includes the Stage 1 priority inbox and the Stage 2 pages for all notifications and priority notifications.

## Run locally

Install dependencies and start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment setup

Copy `.env.example` to `.env.local` and add upstream credentials if they are provided by the evaluator.

- `NOTIFICATION_API_BEARER_TOKEN`
- `NOTIFICATION_API_KEY`
- `NOTIFICATION_API_KEY_HEADER`

If credentials are not provided, the app falls back to demo data so the UI and ranking logic can still be reviewed.

## Pages

- `/`
- `/all-notifications`
- `/priority-notifications`

## Implemented features

- Protected API fetch on the server side
- Stage 1 top n priority inbox logic
- Stage 2 all notifications page
- Stage 2 priority notifications page
- Type filter
- Pagination on all notifications page
- Viewed and new status in local storage
- Material UI based styling

## Verify

```bash
npm run lint
npm run build
```

If you do not configure credentials, the app uses demo data so the pages still work locally.
