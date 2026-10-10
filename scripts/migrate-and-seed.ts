import { Client } from 'pg';

const DB_CONFIGS = [
  // 1. Session mode pooler (IPv4 / Cloud compatible)
  {
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.chzctkckibbgoqsrmqaj',
    password: 'Ashu@3818@123',
    ssl: { rejectUnauthorized: false },
  },
  // 2. Transaction mode pooler (port 6543)
  {
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.chzctkckibbgoqsrmqaj',
    password: 'Ashu@3818@123',
    ssl: { rejectUnauthorized: false },
  },
  // 3. Direct host
  {
    host: 'db.chzctkckibbgoqsrmqaj.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Ashu@3818@123',
    ssl: { rejectUnauthorized: false },
  },
];

const MIGRATION_SQL = `
-- ==============================================
-- 1. PROFILES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  headline TEXT,
  company TEXT,
  job_title TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  learning TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 4,
  experience_level TEXT DEFAULT 'Mid',
  github_url TEXT,
  linkedin_url TEXT,
  connection_status TEXT DEFAULT 'none',
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 2. EVENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  dates TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_city TEXT NOT NULL,
  attendee_count INT DEFAULT 248,
  sessions_count INT DEFAULT 4,
  tracks_count INT DEFAULT 2,
  organizer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 3. COMMUNITY POSTS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  author_id TEXT,
  author_name TEXT,
  author_headline TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  code_snippet TEXT,
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 4. EVENT LOUNGE MESSAGES (HYDERABAD ROOM)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.lounge_messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT,
  sender_name TEXT,
  sender_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 5. DIRECT MESSAGES (1-ON-1)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT,
  sender_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 6. CONNECTION REQUESTS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.connection_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  sender_name TEXT,
  sender_headline TEXT,
  sender_avatar TEXT,
  note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const SEED_SQL = `
-- Insert or Update Event Details
INSERT INTO public.events (id, slug, title, tagline, description, dates, venue_name, venue_city, attendee_count, sessions_count, tracks_count, organizer)
VALUES (
  'ev-hyd-gemini-2026',
  'hyd-antigravity-2026',
  'Build with AI: Cloud Agentic AI & Antigravity Workshop',
  'Connecting developers, creators, and technology leaders in Hyderabad.',
  'Join developers and engineering leaders across Hyderabad for hands-on sessions on Cloud Agentic AI, modern developer platforms, and Antigravity workflows.',
  'Today · 9:00 AM - 1:00 PM IST',
  'Cohort Coworkspaces',
  'Kondapur, Hyderabad',
  248,
  4,
  2,
  'Google Cloud & Community Partners'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  dates = EXCLUDED.dates,
  venue_name = EXCLUDED.venue_name;

-- Seed Attendees
INSERT INTO public.profiles (id, full_name, headline, company, job_title, avatar_url, bio, skills, interests, learning, experience_years, experience_level, github_url, linkedin_url, connection_status, is_verified)
VALUES
(
  'usr-1',
  'Prahasith Naru',
  'Senior Backend Engineer · Python, FastAPI, Databases & AI Agents',
  'Kellton Tech Solutions',
  'Senior Backend Engineer',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'Passionate about building resilient distributed backend services, asynchronous FastAPI microservices, and practical agentic workflows with Antigravity and Gemini.',
  ARRAY['Python 3.13', 'FastAPI', 'PostgreSQL', 'Docker', 'Google Cloud Run', 'Gemini API'],
  ARRAY['AI Agent Frameworks', 'High-throughput APIs', 'Vector Retrieval', 'Antigravity'],
  ARRAY['Gemini 2.5 Flash', 'Temporal Workflows', 'Rust Extensions'],
  6,
  'Senior',
  'https://github.com/prahasith',
  'https://linkedin.com/in/prahasith-naru',
  'connected',
  TRUE
),
(
  'usr-2',
  'Priya Sundaram',
  'Staff ML Engineer · RAG Pipelines & Semantic Search Systems',
  'Freshworks Hyderabad',
  'Staff ML Engineer',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  'Building enterprise retrieval pipelines and domain-specific embeddings. Looking to collaborate on hybrid keyword + vector ranking architectures.',
  ARRAY['Python', 'FastAPI', 'PyTorch', 'pgvector', 'LangChain', 'Antigravity'],
  ARRAY['AI Agent Frameworks', 'Vector Retrieval', 'RAG Evaluation'],
  ARRAY['Deep Research Agents', 'Quantized Inference'],
  8,
  'Lead',
  'https://github.com/priyasundaram',
  'https://linkedin.com/in/priya-sundaram-ml',
  'none',
  TRUE
),
(
  'usr-3',
  'Karthik Varma',
  'Full-Stack Developer · React 19, TypeScript, Tailwind & Cloud Platforms',
  'Cohort Coworkspaces Incubated Startup',
  'Co-Founder & Lead Engineer',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  'Obsessed with snappy developer tooling, modern web design systems, and real-time collaborative frontends.',
  ARRAY['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'PostgreSQL'],
  ARRAY['Real-time Apps', 'Modern UI Design Systems', 'Developer Tooling'],
  ARRAY['WebSockets at Scale', 'Local-first Sync Engines'],
  4,
  'Mid',
  'https://github.com/karthikvarma',
  'https://linkedin.com/in/karthikvarma-dev',
  'none',
  TRUE
),
(
  'usr-4',
  'Deepika Reddy',
  'Cloud Systems Architect · Google Cloud Run, Terraform & Microservices',
  'Deloitte India (Hyderabad)',
  'Cloud Architect',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  'Architecting zero-downtime microservices on GCP. Here at Build with AI to explore serverless hosting of containerized Python AI agents.',
  ARRAY['Google Cloud Run', 'Terraform', 'Docker', 'Python', 'FastAPI', 'Antigravity'],
  ARRAY['High-throughput APIs', 'Serverless Scale-to-Zero', 'Cloud Security'],
  ARRAY['Vertex AI Pipelines', 'eBPF Observability'],
  9,
  'Lead',
  'https://github.com/deepikareddy',
  'https://linkedin.com/in/deepika-reddy-cloud',
  'pending_sent',
  TRUE
),
(
  'usr-5',
  'Rahul Sharma',
  'AI Research Engineer · Prompt Engineering & Tool Calling',
  'IIIT Hyderabad Alumni',
  'AI Research Engineer',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
  'Studying structured schema generation and autonomous function calling in multimodal models.',
  ARRAY['Python 3.13', 'Gemini API', 'Pydantic', 'FastAPI', 'NumPy'],
  ARRAY['AI Agent Frameworks', 'Structured JSON Output', 'Prompt Engineering'],
  ARRAY['Speculative Decoding', 'Multimodal Vision Models'],
  3,
  'Mid',
  'https://github.com/rahulsharma-ai',
  'https://linkedin.com/in/rahulsharma-ai',
  'none',
  TRUE
),
(
  'usr-6',
  'Sneha Patel',
  'Senior Backend Engineer · Distributed Databases & Event Streams',
  'Swiggy Hyderabad Tech Hub',
  'Senior Software Engineer',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
  'Passionate about relational database performance tuning, transactional outbox patterns, and high-concurrency event handling.',
  ARRAY['Python', 'PostgreSQL', 'FastAPI', 'Kafka', 'Redis', 'Docker'],
  ARRAY['High-throughput APIs', 'Antigravity', 'Real-time Apps'],
  ARRAY['DuckDB in Production', 'ClickHouse Analytics'],
  7,
  'Senior',
  'https://github.com/snehapatel',
  'https://linkedin.com/in/sneha-patel-backend',
  'pending_received',
  TRUE
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  headline = EXCLUDED.headline,
  company = EXCLUDED.company,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests;

-- Seed Community Posts
INSERT INTO public.posts (id, author_id, author_name, author_headline, author_avatar, content, code_snippet, likes_count, dislikes_count, comments_count)
VALUES
(
  'post-1',
  'usr-1',
  'Prahasith Naru',
  'Senior Backend Engineer @ Kellton Tech',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'Loving the energy at Cohort Coworkspaces Kondapur today! Just open-sourced the schema for our event matchmaking engine. Using PostgreSQL cosine similarity alongside foreign key constraints.',
  '@router.post("/match", response_model=List[MatchProfile])
async def find_peers(current_user: Annotated[User, Depends(get_current_user)]):
    query = select(Profile).filter(Profile.id != current_user.id)
    return await db.execute(query)',
  28,
  0,
  2
),
(
  'post-2',
  'usr-2',
  'Priya Sundaram',
  'Staff ML Engineer @ Freshworks',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  'Pro tip for everyone building RAG apps today: Do not ignore hybrid keyword filtering (BM25 + pgvector). Pure dense embeddings miss exact code identifiers like function names and error codes.',
  NULL,
  35,
  1,
  1
)
ON CONFLICT (id) DO NOTHING;

-- Seed Lounge Messages (Hyderabad Room)
INSERT INTO public.lounge_messages (id, sender_id, sender_name, sender_avatar, content)
VALUES
(
  'room-1',
  'usr-3',
  'Karthik Varma',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  'Anyone looking for a frontend builder for the hands-on Antigravity workshop? Building with React 19!'
),
(
  'room-2',
  'usr-4',
  'Deepika Reddy',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  'Table 4 in Innovation Lab has power strips and space for 2 more developers working on Cloud Run deployments.'
),
(
  'room-3',
  'usr-1',
  'Prahasith Naru',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'Just deployed the DevConnect AI REST API sample on Cloud Run! Check out the OpenAPI docs if anyone wants to integrate.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Direct Messages
INSERT INTO public.messages (id, conversation_id, sender_id, sender_name, sender_avatar, content)
VALUES
(
  'msg-1',
  'conv-usr-2',
  'usr-1',
  'Prahasith Naru',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'Hi! Great to connect. Are you attending the Cloud Agentic AI session?'
),
(
  'msg-2',
  'conv-usr-2',
  'usr-2',
  'Priya Sundaram',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  'Yes! Sitting in row 3 right now. Testing pgvector with the new Gemini embeddings. Would love to compare notes after the talk!'
),
(
  'msg-3',
  'conv-usr-2',
  'usr-1',
  'Prahasith Naru',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'Awesome. Let us grab coffee at the Cohort cafeteria during lunch.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Connection Request
INSERT INTO public.connection_requests (id, sender_id, receiver_id, sender_name, sender_headline, sender_avatar, note, status)
VALUES
(
  'req-sneha',
  'usr-6',
  'usr-1',
  'Sneha Patel',
  'Senior Backend Engineer @ Swiggy Tech',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
  'Looking forward to the Cloud Agentic AI and Antigravity workshop. Let us connect!',
  'pending'
)
ON CONFLICT (id) DO NOTHING;
`;

async function run() {
  console.log('Connecting to Supabase PostgreSQL database...');
  let client: Client | null = null;
  let connectedConfig: any = null;

  for (const config of DB_CONFIGS) {
    try {
      console.log(`Trying ${config.host}:${config.port} as ${config.user}...`);
      const testClient = new Client(config);
      await testClient.connect();
      client = testClient;
      connectedConfig = config;
      console.log(`Connected successfully to ${config.host}:${config.port}!`);
      break;
    } catch (err: any) {
      console.warn(`Connection failed to ${config.host}:${config.port}: ${err.message}`);
    }
  }

  if (!client) {
    throw new Error('Could not connect to any Supabase host configuration.');
  }

  try {
    console.log('Executing DDL migrations (creating tables)...');
    await client.query(MIGRATION_SQL);
    console.log('Tables created successfully: profiles, events, posts, lounge_messages, messages, connection_requests.');

    console.log('Seeding initial data (attendees, event, posts, messages)...');
    await client.query(SEED_SQL);
    console.log('Data seeded successfully!');

    // Verify row counts
    const resProfiles = await client.query('SELECT COUNT(*) FROM public.profiles;');
    const resPosts = await client.query('SELECT COUNT(*) FROM public.posts;');
    const resLounge = await client.query('SELECT COUNT(*) FROM public.lounge_messages;');
    const resMessages = await client.query('SELECT COUNT(*) FROM public.messages;');
    const resRequests = await client.query('SELECT COUNT(*) FROM public.connection_requests;');

    console.log('==============================================');
    console.log('SUPABASE DATABASE MIGRATION & SEED VERIFIED:');
    console.log(`- Profiles in DB:            ${resProfiles.rows[0].count}`);
    console.log(`- Community Posts in DB:     ${resPosts.rows[0].count}`);
    console.log(`- Lounge Messages in DB:     ${resLounge.rows[0].count}`);
    console.log(`- Direct Messages in DB:     ${resMessages.rows[0].count}`);
    console.log(`- Connection Requests in DB: ${resRequests.rows[0].count}`);
    console.log('==============================================');
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
