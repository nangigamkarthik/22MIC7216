## Stage 1 Frontend Submission

This app is the frontend-track submission for the Campus Notifications Microservice assignment. It uses Next.js with TypeScript so the protected notification API can be accessed on the server while the UI stays in React.

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

## Implemented feature

- Server-side protected API bridge at `src/app/api/priority-inbox/route.ts`
- Priority inbox ranking by `Placement > Result > Event`
- Recency-based tie breaking
- Fixed-size min-heap strategy for maintaining top N efficiently
- Responsive dashboard for screenshots and later-stage expansion
- Root-level `notification_system_design.md` with the Stage 1 explanation

## Verify

```bash
npm run lint
npm run build
```

## Screenshot checklist

- Dashboard showing top 10 notifications
- Dropdown changed to another value like top 15
- If live credentials are configured, show the live API mode banner
- If not, the demo mode banner is acceptable for local proof of work

## Folder structure

- `notification_app_fe` contains the frontend implementation
- `notification_app_be` is kept in the repository to match the submission checklist
- `logging_middleware` remains available for the earlier setup stage
