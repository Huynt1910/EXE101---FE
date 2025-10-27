## Rules and Development Guide

### Purpose

Prototype quickly to validate UX and willingness to book/pay. Prefer simulation over real integrations.

### One-Change-Per-Run Rule

- Each run should introduce exactly one focused edit to the codebase.
- Show the affected file/component before editing.
- Keep edits small, reversible, and shippable.

### Success Metrics (Week 1)

- 1st-booking success rate ≥ 70% (funnel: search → view profile → book → payment simulated).
- Hosts onboarded ≥ 20 (server logs).
- Time-to-book median ≤ 5 minutes (client timing + session IDs).

### Scope (Week 1 Deliverables)

- Landing page with search bar + featured buddies carousel.
- Buddy search & hourly booking flow.
- Create A Trip flow (form + offers system).
- AI Chatbox Booking assistant (basic prompt + top 3 buddy suggestions).
- Host onboarding & inbox with reschedule request feature.
- Booking confirmation with mock payment (VietQR/cash).
- Profile pages for customers and hosts.
- Seed data: 5 buddies, 10 bookings, 3 trip requests.
- Password-gated demo.

### Roles & Access

- Guest: browse without login.
- Customer: login required to book or create a trip; view booking history.
- Host: edit profile, calendar; accept/decline bookings; respond to trip requests; request reschedule.
- Admin: seed data, mark featured buddies, moderate.

### Key Flows

1. Buddy Booking (Hourly): Landing → Search → Buddy profile → Date/time → Duration → Login → Booking summary → Host confirmation → Payment (mock QR/cash) → Confirmation.
2. Create A Trip: Create form → save as "open" → Hosts browse and send offers → Customer selects host → confirm booking.
3. AI Chatbox Booking: Floating assistant → user describes trip → suggest 3 locals or prefill Create Trip → user books or posts trip.
4. Host Reschedule: Detect overlap → Host requests reschedule → Customer Accept/Decline → Update booking time.

### Data Model (prototype)

- Users: id, role, name, email, phone, created_at.
- Buddies: id, user_id, bio, location, video_path, specialties[], price_per_hour, rating_avg, is_featured, languages, activities[].
- Bookings: id, buddy_id, customer_id, start_date, end_date, start_time?, duration_hours, status(pending/confirmed/reschedule_requested/cancelled), payment_method, created_at.
- Trips: id, customer_id, destination, date_from, date_to, num_people, looking_for, activities_selected[], interests_selected[], status(open/matched/confirmed), created_at.
- TripOffers: id, trip_id, buddy_id, status(pending/accepted/rejected).
- Reviews: id, booking_id, rating, comment, created_at.
- Messages: id, booking_id or trip_id, from_role, text, created_at.

### Routes (Week 1)

- `/` Landing with search bar + featured buddies carousel.
- `/search` Buddy results with filters.
- `/buddy/:id` Buddy detail page.
- `/booking/confirm/:id` Confirmation + payment method selection.
- `/trip/create` Create A Trip form.
- `/trip/:id/offers` Customer sees local offers.
- `/profile` Customer booking history.
- `/host/onboard` Host onboarding.
- `/host/inbox` Bookings + Trip requests + Reschedule requests.
- `/admin` Seed + feature toggle.

### Tech & Assumptions

- Next.js (App Router), responsive/mobile-first.
- Firebase: Auth + Firestore/Storage (or mocked layer during week 1).
- Deploy via Vercel; keep secrets server-side.
- Simulated integrations: mock VietQR/ZaloPay flow; cash option; mock webhooks.

### Integrations (Simulated)

- Mock payment webhook payload example:

```json
{
  "booking_id": "bk_001",
  "status": "paid",
  "amount_vnd": 300000,
  "provider": "mock_vietqr"
}
```

- Messaging/notifications: server-side mock notifications to host/customer inbox.

### Authentication & Demo

- Require Sign In/Sign Up (Firebase Email/Social) to book or create trip.
- Allow guest sessions for browsing.
- Password-gated demo at deploy edge (simple gate before app routes).

### Seeding (Week 1)

- Include 5 hosts, 10 experiences, 10 bookings, and 3 trip requests.
- Admin route or script to (re)seed and toggle featured buddies.

### Analytics & KPIs

- Funnel events (client): `search`, `view_experience`, `start_booking`, `payment_success` (with booking id).
- Time-to-book: client timestamps + session id; compute median.
- Host conversion: onboarding completions / host signups.
- Errors & latency: log API errors and page load times.

### Acceptance Criteria

- Customer can complete booking flow and see confirmation.
- Host receives booking in inbox and can accept → calendar entry created.
- Review can be submitted.
- Password-gated link works.
- AI chatbox recommends locals.
- Customers can view booking history.
- Core flows function on mobile.

### Contribution Guidelines

- TypeScript-first; clear, descriptive names; avoid overly short identifiers.
- Follow existing formatting; do not reformat unrelated code.
- Prefer early returns; avoid deep nesting and unnecessary try/catch.
- Comments only for non-obvious rationale/edge cases.
- Keep secrets server-side; never commit credentials.
- Small PRs; meaningful commit messages referencing route/feature.

### Implementation Notes

- Simulate where possible in Week 1; defer real payments/payouts.
- Add analytics events at key funnel points.
- Enforce login gates for booking and trip creation.
- Record consent checkbox for customer contact; retain test data for 30 days.
