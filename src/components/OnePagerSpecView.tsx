import React, { useState } from 'react';
import { Copy, Check, Download, Layers, ShieldCheck, Database, Server, Terminal, Sparkles } from 'lucide-react';

export const OnePagerSpecView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'stitch' | 'architecture' | 'database' | 'api' | 'security'>('overview');

  const fullSpecMarkdown = `# DevConnect AI — One-Pager Technical Specification for Google Stitch & AI Studio

## 1. Executive Summary & Problem Statement
DevConnect AI is an in-person and post-event developer networking platform crafted for the Build with AI Bootcamp in Hyderabad.
It solves the core friction of tech conferences: meeting attendees working with your specific technical stack (e.g. FastAPI, Google Gemini 2.5, PostgreSQL pgvector), remembering their details, exchanging high-context connection requests, chatting 1-on-1, and sharing builds on an event feed.

## 2. System Architecture
- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- Backend: Python 3.13, FastAPI (Asynchronous), Pydantic v1, SQLAlchemy 2.x.
- Persistence: Supabase (PostgreSQL 15, Supabase Auth, Supabase Storage for profile avatars).
- Communications: Realtime event subscriptions & asynchronous SMTP email notifications for connection requests.
- Cloud Target: Google Cloud Run for FastAPI microservice + Static Hosting.

## 3. Stitch Design Tool Frames
1. FRAME-01 (1440x900 & 390x844): Event Landing & Schedule with 3 real counters, track selector, and Cohort Coworkspaces Kondapur Hyderabad venue.
2. FRAME-02 (1440x900): Attendee Discovery & Technical Interest Matcher (Cosine similarity ranking on shared tech stack tags).
3. FRAME-03 (800x720): Attendee Profile Modal with GitHub repository links and learning goals.
4. FRAME-04 (1440x900): 1-on-1 Direct Messaging between accepted peers with end-to-end authorization checks.
5. FRAME-05 (1440x900): Common Event Lounge with rate-limited communal chat.
6. FRAME-06 (1440x900): Community Feed with code snippet highlighting and single-reaction (like/dislike) invariant.
7. FRAME-07 (1440x900): Admin Dashboard for dynamic event configuration, real database metrics, and attendee moderation.

## 4. Database Schema (PostgreSQL 15)
- profiles (UUID PK, full_name, headline, company, skills[], interests[], learning[], github_url, role)
- events (UUID PK, title, dates, venue_name, venue_city, description, is_active)
- connection_requests (UUID PK, sender_id, receiver_id, note, status, created_at)
- connections (UUID PK, user_a_id, user_b_id, created_at)
- conversations (UUID PK, event_id, is_group, created_at)
- messages (UUID PK, conversation_id, sender_id, content, created_at)
- posts (UUID PK, event_id, author_id, content, code_snippet, likes_count, dislikes_count)
- post_reactions (UUID PK, post_id, user_id, reaction, UNIQUE(post_id, user_id))
- comments (UUID PK, post_id, author_id, content, created_at)
- reports (UUID PK, reporter_id, target_type, target_id, reason, status)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSpecMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/70 border border-blue-800/60 text-blue-400 font-mono text-[11px] mb-2">
            <span>SPEC v1.0.0</span>
            <span>·</span>
            <span>GOOGLE STITCH & AI STUDIO READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            DevConnect AI — One-Pager Spec & Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Complete technical blueprint, layout specifications, database entity models, and Stitch prompt contracts for building the seamless event networking platform.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied Spec to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Full Markdown Spec</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {[
          { id: 'overview', label: '1. Executive Summary', icon: Sparkles },
          { id: 'stitch', label: '2. Stitch Frame Specs', icon: Layers },
          { id: 'architecture', label: '3. Technical Stack', icon: Server },
          { id: 'database', label: '4. Relational Database', icon: Database },
          { id: 'api', label: '5. REST API Contract', icon: Terminal },
          { id: 'security', label: '6. Security & RLS', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Executive Summary */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">01.</span>
              <span>Problem Statement & Product Persona</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              At in-person developer conferences and bootcamps (such as <strong>Build with AI / Gemini in Hyderabad</strong>), over 250 developers gather with diverse skills. Traditional networking fails because:
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <li className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <strong className="text-rose-400 block mb-1">Stack Invisibility:</strong>
                Attendees don't know who is using FastAPI, LangChain, or pgvector without awkward cold conversations.
              </li>
              <li className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <strong className="text-rose-400 block mb-1">Lost Post-Event Contacts:</strong>
                Physical business cards and brief handshakes get forgotten within 48 hours after the keynote.
              </li>
              <li className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <strong className="text-rose-400 block mb-1">Cold Inbound Friction:</strong>
                LinkedIn requests lack context. DevConnect AI enforces a personalized 1-sentence note for every request.
              </li>
              <li className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <strong className="text-rose-400 block mb-1">Event Scoping:</strong>
                Generic social feeds are drowned in global noise; DevConnect AI provides an event-scoped common room and feed.
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Event Identity Configurability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The event identity is completely decoupled and dynamic. Administrators can configure:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-300">
              <div className="p-2 bg-slate-800/50 rounded border border-slate-700">Event Title & Tagline</div>
              <div className="p-2 bg-slate-800/50 rounded border border-slate-700">Venue & City</div>
              <div className="p-2 bg-slate-800/50 rounded border border-slate-700">Agenda & Speakers</div>
              <div className="p-2 bg-slate-800/50 rounded border border-slate-700">Banners & Logos</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Stitch Frame Specs */}
      {activeSection === 'stitch' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">02.</span>
              <span>Google Stitch Design Tool Frame Inventory</span>
            </h2>
            <p className="text-xs text-slate-400">
              7 high-fidelity frames optimized for direct generation in Google Stitch and AI Studio:
            </p>

            <div className="space-y-3">
              {[
                {
                  code: 'FRAME-01',
                  name: 'Event Landing & Schedule',
                  vp: '1440×900 & 390×844',
                  components: 'HeroBanner, 3 Real Stat Counters, Track Agenda Timeline, Venue Card',
                  rule: 'No pill badges for static metadata; clean text with · separators.'
                },
                {
                  code: 'FRAME-02',
                  name: 'Attendee Directory & Tech Matcher',
                  vp: '1440×900',
                  components: 'SearchFilterBar, TechStackPills, AttendeeCardsGrid, MatchScoreBadge',
                  rule: 'Ranks attendees by mutual overlap with active stack filters.'
                },
                {
                  code: 'FRAME-03',
                  name: 'Attendee Profile & Build Showcase',
                  vp: '800×720 Modal & 390×844',
                  components: 'ProfileHeader, GitHubRepos, SkillsMatrix, LearningRoadmap, ConnectCTA',
                  rule: 'Never exposes private email or phone numbers unless explicitly shared.'
                },
                {
                  code: 'FRAME-04',
                  name: '1-on-1 Direct Messaging',
                  vp: '1440×900 Split View',
                  components: 'ConversationsList (320px), ChatPane, ActivePeerHeader, MessageComposer',
                  rule: 'Only permitted between accepted connections; rejects unapproved messaging.'
                },
                {
                  code: 'FRAME-05',
                  name: 'Common Event Lounge',
                  vp: '1440×900',
                  components: 'LoungeHeader, PinnedOrganizerAlert, RealtimeRoomStream, RateLimiter',
                  rule: 'Scaped strictly to event_id; 1 message per 3 seconds rate limit.'
                },
                {
                  code: 'FRAME-06',
                  name: 'Community Feed (Builder Log)',
                  vp: '1440×900 (680px Column)',
                  components: 'PostComposer, FeedPost, MonospaceCodeSnippet, SingleReaction, Comments',
                  rule: 'Invariant: Single active reaction per user per post (thumbs up or down).'
                },
                {
                  code: 'FRAME-07',
                  name: 'Admin Dashboard & Moderation',
                  vp: '1440×900',
                  components: 'KPICounterStrip, EventMetadataForm, ModerationQueue, AuditLogs',
                  rule: 'Protected server-side; metrics derived from SQL queries.'
                }
              ].map((f) => (
                <div key={f.code} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                        {f.code}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{f.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400">({f.vp})</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Components: <span className="font-mono text-slate-400">{f.components}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/40">
                    Rule: {f.rule}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Technical Stack */}
      {activeSection === 'architecture' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono">03.</span>
            <span>Mandatory Technology Stack & Architectural Boundaries</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
              <h3 className="font-bold text-white text-sm">Frontend Architecture</h3>
              <p className="text-slate-300 leading-relaxed">
                React 19 with Vite 8 and TypeScript. Styled strictly with Tailwind CSS v4 and Plus Jakarta Sans. Uses a 3-zone Top Bar Contract and strictly prohibits static metadata pill boxes or ornamental telemetry bars.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
              <h3 className="font-bold text-white text-sm">FastAPI Backend (Python 3.13)</h3>
              <p className="text-slate-300 leading-relaxed">
                Asynchronous endpoints under <code className="text-blue-300 font-mono">/api/v1</code>. Strictly adheres to Pydantic v1 schemas. Validates Supabase JWTs on every protected route. Never trusts frontend role claims.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
              <h3 className="font-bold text-white text-sm">Supabase Persistence & Auth</h3>
              <p className="text-slate-300 leading-relaxed">
                PostgreSQL 15+ with pgvector support for semantic matchmaking. Row Level Security (RLS) on all tables. Supabase Storage for attendee avatar uploads.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
              <h3 className="font-bold text-white text-sm">SMTP Email Pipeline</h3>
              <p className="text-slate-300 leading-relaxed">
                Environment-configured SMTP (Gmail, Outlook, custom). Asynchronous background tasks dispatch emails for connection requests and acceptances without blocking database transactions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Relational Database Schema */}
      {activeSection === 'database' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono">04.</span>
            <span>Relational PostgreSQL 15 Entity Schema</span>
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <strong className="text-blue-400">profiles: </strong>
              id (UUID PK, FK auth.users), full_name, headline, company, bio, avatar_url, skills (TEXT[]), interests (TEXT[]), learning (TEXT[]), experience_years, role ('attendee'|'admin'), is_suspended, created_at
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <strong className="text-blue-400">connection_requests: </strong>
              id (UUID PK), sender_id (FK profiles), receiver_id (FK profiles), note (VARCHAR 280), status ('pending'|'accepted'|'rejected'), UNIQUE(sender_id, receiver_id)
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <strong className="text-blue-400">connections: </strong>
              id (UUID PK), user_a_id (FK profiles), user_b_id (FK profiles), created_at, UNIQUE(LEAST(user_a_id, user_b_id), GREATEST(user_a_id, user_b_id))
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <strong className="text-blue-400">messages: </strong>
              id (UUID PK), conversation_id (FK), sender_id (FK profiles), content (TEXT), created_at
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <strong className="text-blue-400">posts & post_reactions: </strong>
              post_reactions: id, post_id (FK), user_id (FK), reaction ('like'|'dislike'), UNIQUE(post_id, user_id) [Guarantees single reaction invariant]
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: REST API Contract */}
      {activeSection === 'api' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono">05.</span>
            <span>REST API Endpoint Blueprint (/api/v1)</span>
          </h2>
          <div className="space-y-2 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-3 p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold w-14">POST</span>
              <span className="text-slate-100">/api/v1/connections/requests</span>
              <span className="text-slate-500 ml-auto">Send connection with custom note</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-blue-400 font-bold w-14">POST</span>
              <span className="text-slate-100">/api/v1/connections/requests/&#123;id&#125;/accept</span>
              <span className="text-slate-500 ml-auto">Accept & unlock 1:1 messaging</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-blue-400 font-bold w-14">GET</span>
              <span className="text-slate-100">/api/v1/profiles?q=fastapi</span>
              <span className="text-slate-500 ml-auto">Filter attendees by stack</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold w-14">POST</span>
              <span className="text-slate-100">/api/v1/posts/&#123;id&#125;/reactions</span>
              <span className="text-slate-500 ml-auto">Toggle single like/dislike</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-purple-400 font-bold w-14">PUT</span>
              <span className="text-slate-100">/api/v1/admin/events/&#123;id&#125;</span>
              <span className="text-slate-500 ml-auto">Update event title, venue, dates</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Security & RLS */}
      {activeSection === 'security' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono">06.</span>
            <span>Security Model & Row Level Security (RLS)</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <strong className="text-white block mb-1">Strict Role Elevation Prevention</strong>
              Public registration only creates attendee accounts. Administrator rights are provisioned exclusively via server-side database flag or service-role credential.
            </div>
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <strong className="text-white block mb-1">Private Messaging Authorization</strong>
              FastAPI and Supabase RLS ensure only participants registered in <code className="text-blue-300">conversation_members</code> can read or write direct messages.
            </div>
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <strong className="text-white block mb-1">Contact Privacy by Default</strong>
              Phone numbers and personal emails are redacted in public profile queries unless explicitly marked public by the user.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
