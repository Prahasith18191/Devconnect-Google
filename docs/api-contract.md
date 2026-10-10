# REST API Contract: DevConnect AI
> Versioned Endpoints under `/api/v1` for FastAPI Backend and Supabase Integration

All protected endpoints require an `Authorization: Bearer <access_token>` header issued by Supabase Auth.

---

## 1. Authentication & Session
- `POST /api/v1/auth/register` — Public registration (Role defaults to `attendee`).
- `POST /api/v1/auth/login` — Sign in with email and password.
- `POST /api/v1/auth/logout` — Revoke active session tokens.
- `GET /api/v1/auth/me` — Retrieve current authenticated user profile and permissions.

---

## 2. Profiles & Attendee Directory
- `GET /api/v1/profiles` — Paginated list of attendees with filters:
  - Query params: `q` (search name/headline/skills), `role_type`, `experience_level`, `skills[]`, `interests[]`, `page`, `page_size`.
- `GET /api/v1/profiles/{user_id}` — Public profile detail view (Excludes private contact info unless allowed).
- `PUT /api/v1/profiles/me` — Update current user's profile, bio, skills, github, linkedin, and preferences.
- `POST /api/v1/profiles/me/avatar` — Upload avatar to Supabase Storage bucket (`avatars`).

---

## 3. Connections & Networking
- `POST /api/v1/connections/requests` — Send a connection request:
  - Payload: `{ "receiver_id": "UUID", "note": "Hey! Loved your talk on FastAPI and Gemini API." }`
  - Invariant: Cannot request self, cannot send duplicate pending request.
- `GET /api/v1/connections/requests/incoming` — List pending requests received.
- `GET /api/v1/connections/requests/outgoing` — List pending requests sent.
- `POST /api/v1/connections/requests/{request_id}/accept` — Accept request (Establishes bidirectional connection & triggers email notification).
- `POST /api/v1/connections/requests/{request_id}/reject` — Reject request.
- `DELETE /api/v1/connections/requests/{request_id}` — Cancel an outgoing pending request.
- `GET /api/v1/connections` — List established connections (Enables 1:1 chat).

---

## 4. Messaging
- `GET /api/v1/conversations` — List user's active 1-on-1 conversations and event lounge.
- `GET /api/v1/conversations/{conv_id}/messages` — Paginated message history.
- `POST /api/v1/conversations/{conv_id}/messages` — Send message.
  - Authorization check: Sender MUST be member of `conversation_members`.
- `GET /api/v1/events/{event_id}/lounge/messages` — Common room messages for Hyderabad event attendees.
- `POST /api/v1/events/{event_id}/lounge/messages` — Send common room message (with rate limiting).

---

## 5. Community Feed
- `GET /api/v1/events/{event_id}/posts` — Paginated community feed.
- `POST /api/v1/events/{event_id}/posts` — Create a post (`content`, `media_url`).
- `DELETE /api/v1/posts/{post_id}` — Delete own post (or Admin moderation).
- `POST /api/v1/posts/{post_id}/reactions` — React to post (`"like"` or `"dislike"`).
  - Enforces single active reaction per user per post.
- `POST /api/v1/posts/{post_id}/comments` — Add a comment.

---

## 6. Administration & Moderation
- `GET /api/v1/admin/analytics` — Event KPIs: Registrations, Connections Made, Active Chats, Feed Posts.
- `PUT /api/v1/admin/events/{event_id}` — Update event title, dates, venue, banner, agenda.
- `GET /api/v1/admin/reports` — Triage reported content or abusive users.
- `POST /api/v1/admin/reports/{report_id}/resolve` — Resolve report and execute moderation action.
- `POST /api/v1/admin/users/{user_id}/suspend` — Suspend attendee account.
