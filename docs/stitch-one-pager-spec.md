# Stitch One-Pager Specification: DevConnect AI
> Design System, Layout Geometry, Component Tokens, and Stitch Prompt Frames for Google AI Studio & Stitch Design Tool.

---

## 1. Executive Summary & Design Constitution

- **Product Name**: DevConnect AI
- **Tagline**: One event. Many builders. Meaningful connections.
- **Design Archetype**: High-density developer platform with clean structural typography, crisp contrast, and zero AI-slop visual discipline.
- **Color Palette (60-30-10 Rule)**:
  - `60% Neutral Canvas`: Pure Slate 900 (`#0F172A`) dark mode or Clean Slate 50 (`#F8FAFC`) light mode.
  - `30% Structural Surfaces`: Slate 800 (`#1E293B`) cards, 1px borders (`#334155`), slate typography (`#94A3B8`).
  - `10% Action Accent`: High-voltage Electric Blue (`#2563EB`) & Emerald (`#10B981`) for active connections.
- **Typography Tokens**:
  - Headings: `Plus Jakarta Sans` (Weights 600, 700)
  - Body & UI: `Plus Jakarta Sans` (Weights 400, 500)
  - Data / Telemetry: `JetBrains Mono` (`font-mono tabular-nums`)
- **Anti-Slop Discipline**:
  - No static pill badges for metadata (clean unboxed text with `·` separators).
  - No pseudo-code comments (`// 01`) or fake latency tickers.
  - Strict top-bar contract: 1-line brand wordmark + 4-5 single-line links + 1 primary action.

---

## 2. Stitch Canvas Frame Inventory

| Frame ID | Name | Target Viewport | Core Intent & Interactivity |
|---|---|---|---|
| **STITCH-01** | **Event Landing & Schedule** | `1440x900` (Desktop) & `390x844` (Mobile) | Event hero banner, live countdown, agenda tracks, speaker lineup, attendee count badge, and onboarding CTA. |
| **STITCH-02** | **Attendee Discovery & Interest Matcher** | `1440x900` & `390x844` | Match score ranking based on shared tech stack (e.g. FastAPI + Gemini API), search/role filters, Connect modal trigger. |
| **STITCH-03** | **Attendee Profile & Build Showcase** | `1440x900` (Modal) & `390x844` (Screen) | Deep developer profile with GitHub, LinkedIn, current projects, learning roadmap, and custom connection note. |
| **STITCH-04** | **1-on-1 Direct Messaging** | `1440x900` (Split Pane) & `390x844` | Authorized direct chat between accepted peers, unread indicators, message timestamps, active status. |
| **STITCH-05** | **Common Event Lounge (Room Chat)** | `1440x900` & `390x844` | Event-scoped communal discussion for Hyderabad bootcamp attendees, breakout channels, and rate-limited posting. |
| **STITCH-06** | **Community Feed (Builder Log)** | `1440x900` & `390x844` | Developer feed: post updates, code snippets, project demo screenshots, single-reaction like/dislike, comments. |
| **STITCH-07** | **Admin Control & Moderation** | `1440x900` | Real event statistics, attendee management, report triage, audit logs, and event metadata editor. |

---

## 3. Stitch Frame Prompts for AI Studio Generation

### Prompt for STITCH-01 (Event Landing Page)
```
Design a modern, high-precision event landing page for "DevConnect AI — Build with AI Hyderabad Bootcamp".
Viewport: 1440px desktop responsive to 390px mobile.
Palette: Deep slate canvas (#0F172A), crisp neutral borders (#334155), electric blue accents (#2563EB).
Layout:
- Top Bar: Single text wordmark "DevConnect AI", nav links (Discover, Agenda, Feed, Lounge), and single CTA button "Join Event".
- Hero Section: Headline "Build with AI Bootcamp: Hyderabad", subtext "Connect with 250+ backend engineers, AI builders, and founders in Hyderabad.", 3 real stat counters (248 Builders Registered, 18 Live Sessions, 4 Tracks), and "Find Collaborators" CTA.
- Agenda Timeline: 4 interactive session blocks (09:00 Registration, 10:00 Building with Gemini 2.5 & FastAPI, 14:00 Hackathon & Networking, 17:00 Demo Pitching).
- Venue & Organizers card: Venue "T-Hub Hyderabad", Organizer "Google Developer Groups Hyderabad".
Typography: Plus Jakarta Sans with tabular-nums for dates and statistics.
```

### Prompt for STITCH-02 (Attendee Discovery & Matcher)
```
Design a developer discovery and technical interest matching interface for "DevConnect AI".
Viewport: 1440px desktop.
Layout:
- Header search bar with filters for Role (Backend, Full-Stack, AI/ML), Experience (Junior, Mid, Senior, Lead), and Tech Stack tags (FastAPI, PyTorch, Gemini API, PostgreSQL, LangChain).
- Matchmaker Hero: "Find developers building with your stack" with quick-toggle interest pills (Active filters: FastAPI + Gemini API).
- Grid of 6 rich Attendee Cards:
  - Developer photo (1:1 square rounded), Full Name, Headline, Company ("Staff Backend Engineer @ Kellton").
  - Match percentage indicator: e.g. "94% Match · Both exploring LangChain & FastAPI".
  - Skills row: Unboxed tag list with dot separators (Python · FastAPI · PostgreSQL · Vector Search).
  - Primary button: "Connect" with hover state that opens "Send Request with Note" modal.
```

### Prompt for STITCH-04 & STITCH-05 (Messaging & Event Lounge)
```
Design a dual-pane messaging interface for an in-person developer event.
Left Pane: Conversation List with search, tabbed between "Direct Messages" (Accepted connections only) and "Event Lounge" (Hyderabad General Room).
Right Pane: Active Chat window with recipient header (Avatar, Name, Headline, "Connected"), message history with readable speech bubbles, sender timestamp (JetBrains Mono tabular-nums), and clean input field with "Send message..." and send button.
```

### Prompt for STITCH-06 (Community Feed)
```
Design a developer community feed for "DevConnect AI".
Central 680px column:
- Post Creator box: Avatar, textarea "What are you building at the bootcamp?", attachment button for project screenshots, and "Post" button.
- Feed items: Post author details, timestamp, post body with monospace code block support, image attachment preview, reaction buttons (Thumbs Up counter, Thumbs Down counter with single active reaction rule), and comment thread with reply input.
```
