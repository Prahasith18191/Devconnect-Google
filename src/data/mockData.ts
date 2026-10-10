import { AttendeeProfile, EventDetails, AgendaItem, CommunityPost, ChatMessage, StitchFrameSpec } from '../types';

export const INITIAL_EVENT: EventDetails = {
  id: 'ev-hyd-gemini-2026',
  title: 'Build with AI: Cloud Agentic AI & Antigravity Workshop',
  tagline: 'Connecting developers, creators, and technology leaders in Hyderabad.',
  dates: 'Today · 9:00 AM - 1:00 PM IST',
  venueName: 'Cohort Coworkspaces',
  venueCity: 'Kondapur, Hyderabad',
  description: 'Join developers and engineering leaders across Hyderabad for hands-on sessions on Cloud Agentic AI, modern developer platforms, and Antigravity workflows.',
  attendeeCount: 6,
  sessionsCount: 4,
  tracksCount: 2,
  organizer: 'Google Cloud & Community Partners',
  communityGuidelines: [
    'Be welcoming, inclusive, and professional with fellow attendees.',
    'Collaborate openly and share knowledge and constructive feedback.',
    'Respect attendee privacy and personal contact preferences.',
    'Keep conversations focused on engineering, design, and building.'
  ]
};

export const INITIAL_AGENDA: AgendaItem[] = [
  {
    id: 'ag-1',
    time: '9:00 - 9:30 AM',
    title: 'Registrations & Welcome',
    speaker: 'Event Organizing Team',
    speakerRole: 'Community Hosts',
    track: 'Main Hall',
    room: 'Auditorium'
  },
  {
    id: 'ag-2',
    time: '9:45 - 10:30 AM',
    title: 'Cloud Agentic AI Session',
    speaker: 'Google Cloud & AI Specialists',
    speakerRole: 'AI Solutions Engineering',
    track: 'Technical Session',
    room: 'Auditorium'
  },
  {
    id: 'ag-3',
    time: '10:30 AM - 12:30 PM',
    title: 'Hands-on workshop on Antigravity',
    speaker: 'Workshop Mentors & Engineering Leads',
    speakerRole: 'Antigravity Core Mentors',
    track: 'Hands-on Arena',
    room: 'Innovation Lab'
  },
  {
    id: 'ag-4',
    time: '12:30 - 1:00 PM',
    title: 'Closure & Lunch',
    speaker: 'Community Leads',
    speakerRole: 'Networking & Networking Lunch',
    track: 'Main Hall',
    room: 'Dining Arena'
  }
];

export const INITIAL_ATTENDEES: AttendeeProfile[] = [
  {
    id: 'usr-1',
    fullName: 'Prahasith Naru',
    headline: 'Senior Backend Engineer · Python, FastAPI, Databases & AI Agents',
    company: 'Kellton Tech Solutions',
    jobTitle: 'Senior Backend Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Passionate about building resilient distributed backend services, asynchronous FastAPI microservices, and practical agentic workflows with Google Gemini.',
    skills: ['Python 3.13', 'FastAPI', 'PostgreSQL', 'Docker', 'Google Cloud Run', 'Gemini API', 'SQLAlchemy'],
    interests: ['AI Agent Frameworks', 'High-throughput APIs', 'Vector Retrieval', 'PostgreSQL RLS'],
    learning: ['Gemini 2.5 Flash Multimodal', 'Temporal Workflows', 'Rust for Python Extensions'],
    experienceYears: 6,
    experienceLevel: 'Senior',
    githubUrl: 'https://github.com/prahasith',
    linkedinUrl: 'https://linkedin.com/in/prahasith-naru',
    projects: [
      { title: 'DevConnect AI', desc: 'Event networking platform for developer bootcamps in Hyderabad.' },
      { title: 'FastAPI Agent Proxy', desc: 'Asynchronous streaming gateway for LLM tool calling.' }
    ],
    connectionStatus: 'connected',
    isVerified: true
  },
  {
    id: 'usr-2',
    fullName: 'Priya Sundaram',
    headline: 'Staff ML Engineer · RAG Pipelines & Semantic Search Systems',
    company: 'Freshworks Hyderabad',
    jobTitle: 'Staff ML Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Building enterprise retrieval pipelines and domain-specific embeddings. Looking to collaborate on hybrid keyword + vector ranking architectures.',
    skills: ['Python', 'FastAPI', 'PyTorch', 'pgvector', 'LangChain', 'Gemini API', 'Kubernetes'],
    interests: ['AI Agent Frameworks', 'Vector Retrieval', 'RAG Evaluation'],
    learning: ['Deep Research Agents', 'Quantized Inference'],
    experienceYears: 8,
    experienceLevel: 'Lead',
    githubUrl: 'https://github.com/priyasundaram',
    linkedinUrl: 'https://linkedin.com/in/priya-sundaram-ml',
    projects: [
      { title: 'Enterprise Vector Gate', desc: 'Scalable pgvector indexing benchmark tool.' }
    ],
    connectionStatus: 'none',
    isVerified: true
  },
  {
    id: 'usr-3',
    fullName: 'Karthik Varma',
    headline: 'Full-Stack Developer · React 19, TypeScript, Tailwind & Supabase',
    company: 'Cohort Coworkspaces Incubated Startup',
    jobTitle: 'Co-Founder & Lead Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Obsessed with snappy developer tooling, modern web design systems, and real-time multiplayer frontends.',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'Node.js', 'PostgreSQL'],
    interests: ['Real-time Apps', 'Modern UI Design Systems', 'Developer Tooling'],
    learning: ['WebSockets at Scale', 'Local-first Sync Engines'],
    experienceYears: 4,
    experienceLevel: 'Mid',
    githubUrl: 'https://github.com/karthikvarma',
    linkedinUrl: 'https://linkedin.com/in/karthikvarma-dev',
    projects: [
      { title: 'CanvasSync', desc: 'Collaborative real-time wireframing canvas.' }
    ],
    connectionStatus: 'none',
    isVerified: true
  },
  {
    id: 'usr-4',
    fullName: 'Deepika Reddy',
    headline: 'Cloud Systems Architect · Google Cloud Run, Terraform & Microservices',
    company: 'Deloitte India (Hyderabad)',
    jobTitle: 'Cloud Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Architecting zero-downtime microservices on GCP. Here at Build with AI to explore serverless hosting of containerized Python AI agents.',
    skills: ['Google Cloud Run', 'Terraform', 'Docker', 'Python', 'FastAPI', 'CI/CD Pipelines'],
    interests: ['High-throughput APIs', 'Serverless Scale-to-Zero', 'Cloud Security'],
    learning: ['Vertex AI Pipelines', 'eBPF Observability'],
    experienceYears: 9,
    experienceLevel: 'Architect',
    githubUrl: 'https://github.com/deepikareddy',
    linkedinUrl: 'https://linkedin.com/in/deepika-reddy-cloud',
    projects: [
      { title: 'GCP Terraform Blueprint', desc: 'Production-ready Cloud Run + Cloud SQL infra-as-code.' }
    ],
    connectionStatus: 'pending_sent',
    isVerified: true
  },
  {
    id: 'usr-5',
    fullName: 'Rahul Sharma',
    headline: 'AI Research Engineer · Prompt Engineering & Multimodal Tool Calling',
    company: 'IIIT Hyderabad Alumni / Freelance',
    jobTitle: 'AI Research Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Studying structured schema generation and autonomous function calling in small multimodal LLMs.',
    skills: ['Python 3.13', 'Gemini API', 'Pydantic', 'FastAPI', 'Hugging Face', 'NumPy'],
    interests: ['AI Agent Frameworks', 'Structured JSON Output', 'Prompt Engineering'],
    learning: ['Speculative Decoding', 'Multimodal Vision Models'],
    experienceYears: 3,
    experienceLevel: 'Mid',
    githubUrl: 'https://github.com/rahulsharma-ai',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma-ai',
    connectionStatus: 'none',
    isVerified: false
  },
  {
    id: 'usr-6',
    fullName: 'Sneha Patel',
    headline: 'Senior Backend Engineer · Distributed Databases & Event Streams',
    company: 'Swiggy Hyderabad Tech Hub',
    jobTitle: 'Senior Software Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Passionate about relational database performance tuning, transactional outbox patterns, and high-concurrency event handling.',
    skills: ['Python', 'PostgreSQL', 'FastAPI', 'Kafka', 'Redis', 'Docker'],
    interests: ['High-throughput APIs', 'PostgreSQL RLS', 'Real-time Apps'],
    learning: ['DuckDB in Production', 'ClickHouse Analytics'],
    experienceYears: 7,
    experienceLevel: 'Senior',
    githubUrl: 'https://github.com/snehapatel',
    linkedinUrl: 'https://linkedin.com/in/sneha-patel-backend',
    connectionStatus: 'pending_received',
    isVerified: true
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-usr-1',
    senderId: 'usr-1',
    senderName: 'Prahasith Naru',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Hi! Great to connect. Are you attending the 10:00 AM session on Gemini 2.5 and FastAPI?',
    timestamp: '10:05 AM',
    isSelf: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-usr-1',
    senderId: 'usr-2',
    senderName: 'Priya Sundaram',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Yes! Sitting in row 3 right now. We are testing pgvector with the new Gemini embedding models. Would love to compare notes after the talk!',
    timestamp: '10:07 AM',
    isSelf: false
  },
  {
    id: 'msg-3',
    conversationId: 'conv-usr-1',
    senderId: 'usr-1',
    senderName: 'Prahasith Naru',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Awesome. Let\'s grab coffee at the Cohort cafeteria during the 1:00 PM lunch break.',
    timestamp: '10:09 AM',
    isSelf: true
  }
];

export const INITIAL_ROOM_MESSAGES: ChatMessage[] = [
  {
    id: 'room-1',
    conversationId: 'lounge-hyd',
    senderId: 'usr-3',
    senderName: 'Karthik Varma',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Anyone looking for a frontend builder for the afternoon hackathon? Building with React 19 and Tailwind v4!',
    timestamp: '10:45 AM',
    isSelf: false
  },
  {
    id: 'room-2',
    conversationId: 'lounge-hyd',
    senderId: 'usr-4',
    senderName: 'Deepika Reddy',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Table 4 in the Co-Working Arena has power strips and space for 2 more developers working on Cloud Run deployments.',
    timestamp: '10:52 AM',
    isSelf: false
  },
  {
    id: 'room-3',
    conversationId: 'lounge-hyd',
    senderId: 'usr-1',
    senderName: 'Prahasith Naru',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Just deployed the DevConnect AI REST API sample on Cloud Run! Check out the OpenAPI docs if anyone wants to integrate.',
    timestamp: '11:02 AM',
    isSelf: true
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-1',
    authorName: 'Prahasith Naru',
    authorHeadline: 'Senior Backend Engineer @ Kellton Tech',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Loving the energy here at Cohort Coworkspaces Kondapur today! Just open-sourced the schema for our event matchmaking engine. Using PostgreSQL cosine similarity over developer skill vectors alongside strict foreign key constraints for connection requests.',
    codeSnippet: `@router.post("/match", response_model=List[MatchProfile])
async def find_peers(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    query = select(Profile).filter(Profile.id != current_user.id)
    return await db.execute(query)`,
    likesCount: 28,
    dislikesCount: 0,
    commentsCount: 3,
    userReaction: 'like',
    timestamp: '2 hours ago',
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'usr-2',
        authorName: 'Priya Sundaram',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'Clean! How are you handling reciprocal connection requests when both send simultaneously?',
        timestamp: '1 hour ago'
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'usr-1',
        authorName: 'Prahasith Naru',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'We use a database transaction that checks for an existing inverted request and auto-accepts if found!',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'usr-2',
    authorName: 'Priya Sundaram',
    authorHeadline: 'Staff ML Engineer @ Freshworks',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    content: 'Pro tip for everyone building RAG apps today: Do not ignore hybrid keyword filtering (BM25 + pgvector). Pure dense embeddings miss exact code identifiers like function names and error codes.',
    likesCount: 35,
    dislikesCount: 1,
    commentsCount: 2,
    userReaction: null,
    timestamp: '3 hours ago',
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorId: 'usr-5',
        authorName: 'Rahul Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
        content: '100% agreed. Especially for Python exception traces where line numbers and exact package names matter.',
        timestamp: '2 hours ago'
      }
    ]
  }
];

export const STITCH_FRAMES: StitchFrameSpec[] = [
  {
    id: 'stitch-01',
    frameCode: 'FRAME-01',
    name: 'Event Landing & Schedule',
    purpose: 'Hero branding, live stats, track agenda, venue info, and primary registration gateway.',
    desktopDimensions: '1440 × 900 px',
    mobileDimensions: '390 × 844 px',
    targetComponents: ['EventHero', 'LiveStatsStrip', 'AgendaTimeline', 'VenueCard', 'PrimaryCTA'],
    designTokens: {
      background: 'Slate 900 (#0F172A)',
      surfaces: 'Slate 800 (#1E293B) with 1px border (#334155)',
      accents: 'Electric Blue (#2563EB) & Cyan (#06B6D4)',
      typography: 'Plus Jakarta Sans (Headings 700, Body 400), JetBrains Mono (Numbers)'
    },
    keyInteractions: [
      'Click "Join Event / Discover Builders" jumps straight to interest matcher.',
      'Interactive track selector (AI Architecture vs Data Systems vs Hackathon).',
      'Venue maps and guidelines drawer.'
    ],
    stitchPrompt: `Stitch Frame 01: Event Landing Page (DevConnect AI)
Design a premium developer conference landing frame for "Build with AI Bootcamp: Hyderabad".
Size: 1440x900 desktop responsive layout.
Palette: Clean slate-900 background, crisp 1px slate-700 hairline borders, electric blue (#2563EB) accent buttons.
Elements:
1. Top Bar: Wordmark "DevConnect AI", nav links (Discover, Agenda, Feed, Lounge), CTA button "Find Builders".
2. Hero Section: Headline "Build with AI Bootcamp: Hyderabad", subtext "Connect with 250+ backend engineers, AI builders, and founders in Hyderabad.", 3 metric counters with tabular numbers (248 Builders, 12 Sessions, 3 Tracks).
3. Schedule Timeline: 4 interactive cards with time badges, session title, speaker name, and room tags.
4. Venue Card: Cohort Coworkspaces Kondapur Hyderabad, Google Developer Groups Hyderabad.`
  },
  {
    id: 'stitch-02',
    frameCode: 'FRAME-02',
    name: 'Attendee Directory & Technical Interest Matcher',
    purpose: 'Algorithmic matchmaking based on shared tech stack (e.g. FastAPI + Gemini API), search, and high-context connection sending.',
    desktopDimensions: '1440 × 900 px',
    mobileDimensions: '390 × 844 px',
    targetComponents: ['SearchFilterBar', 'TechStackQuickFilter', 'AttendeeGrid', 'MatchScoreBadge', 'ConnectModal'],
    designTokens: {
      background: 'Slate 900 (#0F172A)',
      surfaces: 'Slate 800/90 cards with subtle hover lift',
      accents: 'Emerald (#10B981) for mutual match, Blue (#2563EB) for primary actions',
      typography: 'Unboxed skill tags with dot separators (Python · FastAPI · PostgreSQL)'
    },
    keyInteractions: [
      'Select technical interests (FastAPI, Gemini API, PyTorch) to trigger real-time ranked match scores.',
      'Filter by role (Backend, ML, Full-Stack) and seniority (Senior, Lead).',
      'Click "Connect" to open high-context note modal ("Why do you want to connect?").',
      'Click card to inspect deep developer portfolio & GitHub projects.'
    ],
    stitchPrompt: `Stitch Frame 02: Attendee Discovery & Technical Matcher (DevConnect AI)
Design a developer matchmaking directory for 1440px desktop.
Header: Search input with role filter pills (All, Backend, ML/AI, Full-Stack, Cloud) and quick tech stack filter tags (FastAPI, Gemini API, PostgreSQL, LangChain).
Active Filter Banner: "Matching with your stack: Python, FastAPI & Gemini API (4 builders found)".
Cards Grid (3 columns):
- Profile Photo (1:1 square rounded), Name, Headline ("Senior Backend Engineer @ Kellton").
- Match indicator: "94% Match · Both building with FastAPI & Gemini".
- Skills: Unboxed text row separated by middle dots (Python · FastAPI · PostgreSQL · Docker).
- Action: "Connect" button with clean state transition to "Pending" once clicked.`
  },
  {
    id: 'stitch-03',
    frameCode: 'FRAME-03',
    name: 'Attendee Profile & Build Showcase',
    purpose: 'Deep developer inspection with project repository links, learning roadmap, and mutual interests.',
    desktopDimensions: '800 × 720 px (Modal)',
    mobileDimensions: '390 × 844 px',
    targetComponents: ['ProfileHeader', 'ProjectShowcase', 'SkillsMatrix', 'LearningGoals', 'ConnectionActionGroup'],
    designTokens: {
      background: 'Slate 850 (#151F32)',
      surfaces: 'Slate 800 (#1E293B)',
      accents: 'Blue 600 (#2563EB) & GitHub Dark (#24292F)',
      typography: 'Clean readable prose, max 70ch width, tabular stats'
    },
    keyInteractions: [
      'External link outs to GitHub & LinkedIn.',
      'Shows shared bootcamp interests with highlighting.',
      'Displays verified bootcamp badge and connection status.'
    ],
    stitchPrompt: `Stitch Frame 03: Profile Detail Modal (DevConnect AI)
Design a modal sheet for an attendee profile in DevConnect AI.
Size: 800px width centered dialog.
Top: Avatar, Name "Prahasith Naru", Headline, Company, Verified Badge.
Section 1: "About & Engineering Focus" with crisp 2-sentence bio.
Section 2: "Current Bootcamp Projects" with clickable repository links and description.
Section 3: "Tech Stack & Currently Learning" categorized cleanly.
Bottom: Primary "Send Connection Request" CTA with custom note input field.`
  },
  {
    id: 'stitch-04',
    frameCode: 'FRAME-04',
    name: '1-on-1 Direct Messaging',
    purpose: 'Private conversation for accepted peers with active connection verification and unread badges.',
    desktopDimensions: '1440 × 900 px',
    mobileDimensions: '390 × 844 px',
    targetComponents: ['ConversationList', 'ChatHeader', 'MessageHistoryList', 'MessageInputBar'],
    designTokens: {
      background: 'Slate 900 (#0F172A)',
      surfaces: 'Left sidebar Slate 850 (#151F32), Chat Pane Slate 900 (#0F172A)',
      accents: 'Self bubble: Blue 600 (#2563EB), Peer bubble: Slate 800 (#1E293B)',
      typography: 'Timestamps in JetBrains Mono 11px (#64748B)'
    },
    keyInteractions: [
      'Real-time message sending simulation with optimistic UI update.',
      'Only accepted connections appear in the active conversation list.',
      'Unread message counter badge.'
    ],
    stitchPrompt: `Stitch Frame 04: 1-on-1 Direct Messaging (DevConnect AI)
Design a responsive split-pane chat interface for accepted connections.
Left Panel (360px): Search conversations, Active peer list with avatar, name, last message preview, and timestamp.
Right Panel: Header with peer name, headline, and "Connected" status.
Chat Canvas: Scrollable history of speech bubbles (Blue for self, slate for peer) with timestamps.
Input Area: Full-width input with placeholder "Send message to Priya...", attachment icon, and Send button.`
  },
  {
    id: 'stitch-05',
    frameCode: 'FRAME-05',
    name: 'Common Event Lounge (Room Chat)',
    purpose: 'Hyderabad bootcamp communal discussion room with rate limits, table coordination, and announcements.',
    desktopDimensions: '1440 × 900 px',
    mobileDimensions: '390 × 844 px',
    targetComponents: ['LoungeHeader', 'PinnedAnnouncement', 'LiveRoomStream', 'RateLimitCounter'],
    designTokens: {
      background: 'Slate 900 (#0F172A)',
      surfaces: 'Card surfaces Slate 800 (#1E293B)',
      accents: 'Amber 500 (#F59E0B) for pinned organizer notices',
      typography: 'Streamlined chat layout with attendee company badges'
    },
    keyInteractions: [
      'Pinned organizer alert at top (e.g., Hackathon kickoff at 2 PM).',
      'Send live message to all Hyderabad attendees.',
      'Report message action for moderation safety.'
    ],
    stitchPrompt: `Stitch Frame 05: Common Event Room Lounge (DevConnect AI)
Design a communal real-time event room interface for Hyderabad bootcamp attendees.
Top Banner: Pinned Announcement from Organizers: "Hackathon kickoff in Co-Working Arena at 2:00 PM!".
Main Message Stream: Compact messages with author avatar, author name, company affiliation, timestamp, and message body.
Rate Limit Counter: "1 message every 3 seconds to prevent spam".`
  },
  {
    id: 'stitch-06',
    frameCode: 'FRAME-06',
    name: 'Community Feed (Builder Log)',
    purpose: 'LinkedIn-inspired builder feed with code snippets, screenshot sharing, single-reaction like/dislike invariant, and comments.',
    desktopDimensions: '1440 × 900 px',
    mobileDimensions: '390 × 844 px',
    targetComponents: ['CreatePostCard', 'FeedPostCard', 'CodeSnippetBlock', 'ReactionActionBar', 'CommentThread'],
    designTokens: {
      background: 'Slate 900 (#0F172A)',
      surfaces: 'Slate 800 (#1E293B) cards with clean hairline borders',
      accents: 'Blue 500 (#3B82F6) for Like, Slate 400 for Dislike, Green for code syntax',
      typography: 'Code in JetBrains Mono with syntax contrast'
    },
    keyInteractions: [
      'Publish new post with text and optional Python code block.',
      'Single reaction rule: clicking Dislike automatically removes Like.',
      'Expandable comment thread with inline reply input.'
    ],
    stitchPrompt: `Stitch Frame 06: Community Builder Feed (DevConnect AI)
Design a high-quality developer feed layout inspired by LinkedIn but tailored for engineers.
Central Column (680px wide):
- Post Composer: Avatar, textarea "Share what you are building today...", code snippet toggle, and Post CTA.
- Post Card 1: Author "Prahasith Naru @ Kellton", timestamp, text describing PostgreSQL cosine similarity, dark monospace syntax-highlighted code block, reaction counters (28 Likes · 0 Dislikes · 3 Comments), and expanded comment section.
- Post Card 2: Author "Priya Sundaram", tip about hybrid keyword + vector search.`
  },
  {
    id: 'stitch-07',
    frameCode: 'FRAME-07',
    name: 'Admin Dashboard & Moderation Console',
    purpose: 'Event configuration (venue, dates, agenda), real SQL-derived metrics, attendee suspension, and report triage.',
    desktopDimensions: '1440 × 900 px',
    mobileDimensions: '390 × 844 px',
    targetComponents: ['MetricStatCards', 'EventMetadataEditor', 'ReportModerationTable', 'AuditLogTable'],
    designTokens: {
      background: 'Slate 950 (#020617)',
      surfaces: 'Slate 900 (#0F172A) panels, 1px border (#1E293B)',
      accents: 'Crimson 500 (#EF4444) for Suspension, Blue 600 (#2563EB) for Event Updates',
      typography: 'Dense data table with tabular-nums'
    },
    keyInteractions: [
      'Edit Event Title, Venue Name, and Dates with instant preview update.',
      'Real database metrics: Total Registered (248), Active Connections (142), Posts (38), Reports (2).',
      'Resolve user reports and inspect audit logs.'
    ],
    stitchPrompt: `Stitch Frame 07: Admin Dashboard & Event Moderation (DevConnect AI)
Design an enterprise-grade administrative console for event organizers.
Top KPI Strip: 4 tabular metric boxes (Total Registered Attendees: 248, Verified: 210, Connections Formed: 142, Active Reports: 2).
Left Panel: Event Details Editor (Form with Title, Tagline, Venue, Dates, and Save button).
Right Panel: Moderation Queue table (Reported item, Reporter, Reason, Action buttons: Resolve / Delete Content / Suspend User).`
  }
];
