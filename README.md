# Bonddy Frontend

Frontend for Bonddy, a marketplace that helps travelers explore Ho Chi Minh City with local buddies.  
This project includes public discovery pages, traveler flows, buddy workspace, admin area, real-time chat, and payment-related pages.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI
- TanStack Query
- Axios
- Firebase Authentication
- SignalR for real-time chat

## Main Features

- Public homepage and static information pages
- Browse buddy list and view buddy profiles
- Apply to become a buddy
- Traveler trip request flow
- Direct chat with buddies
- Traveler profile, trips, bookings, notifications, and messages
- Buddy dashboard, trip requests, and messaging
- Admin area and route-based access control
- Login, signup, forgot password, reset password, verify email
- Payment success/cancel handling

## Project Structure

```text
src/
  app/
    (public)/         Public pages
    (auth)/           Auth pages
    (trip)/           Trip request and payment flows
    (user)/           Traveler pages
    (buddy)/          Buddy workspace
    (admin)/          Admin pages
    @modal/           Intercepted modal routes for login/signup
  components/         Shared UI and page sections
  features/           Domain hooks, services, query keys, API types
  lib/                HTTP client, auth helpers, providers, config, hub
  content/            Static content data
  styles/             Extra animations and styling helpers
```

## Roles and Route Areas

- `User`: traveler-facing flows such as profile, messages, trips, trip requests
- `Buddy`: buddy dashboard, trip requests, buddy messages
- `Admin`: admin area

Route guards are handled through middleware and server-side access helpers.

## Environment Variables

Create `.env.local` in the project root.

### Required for API

```env
NEXT_PUBLIC_API_BASE_URL=
```

### Optional API config

```env
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_CHAT_HUB_PATH=
```

### Required for Google / Firebase auth

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Optional Firebase config

```env
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Build Notes

- The app uses client and server route guards.
- API configuration is resolved lazily at runtime to avoid breaking static prerender unnecessarily.
- If production requests fail, verify that `NEXT_PUBLIC_API_BASE_URL` and related auth/chat variables are configured in the deployment environment.

## Important Flows

### Authentication

- Full-page auth pages live under `(auth)`
- Login and signup can also open as intercepted modal routes under `@modal`
- Successful login redirects by role:
  - `Buddy` -> `/buddy`
  - `Admin` -> `/admin`
  - default user -> `/`

### Chat

- Traveler chat page: `/messages`
- Buddy chat page: `/buddy/messages`
- Real-time messaging uses SignalR
- Direct buddy contact can create or open a chat room directly from the buddy profile

### Trip Requests

- Public/traveler trip request flow lives at `/trip-request`
- Draft form data can be preserved before login
- Buddy-related chat/offer flows are connected to trip and chat features

## Deployment

This project is designed to run on Vercel or any Node-compatible hosting for Next.js.

Recommended deployment checklist:

1. Set all required environment variables
2. Run `npm run build`
3. Verify auth callback and API base URL configuration
4. Verify chat hub configuration for real-time messaging

## Notes for Contributors

- Shared UI components live in `src/components/ui`
- Domain logic should stay in `src/features`
- HTTP and auth infrastructure lives in `src/lib`
- Prefer keeping route-specific UI inside its route group under `src/app`

## License

Internal project for Bonddy.
