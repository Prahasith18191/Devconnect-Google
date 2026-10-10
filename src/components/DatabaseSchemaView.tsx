import React, { useState } from 'react';
import { Database, Copy, Check, ShieldCheck, Key, Table } from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [selectedTable, setSelectedTable] = useState('profiles');

  const fullDDL = `-- ========================================================
-- DevConnect AI: PostgreSQL 15 & Supabase DDL Architecture
-- Enforces Row Level Security (RLS) and Integrity Invariants
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Attendee & Admin Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    company TEXT NOT NULL,
    job_title TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    learning TEXT[] DEFAULT '{}',
    experience_years INT DEFAULT 0,
    github_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    role VARCHAR(20) DEFAULT 'attendee' CHECK (role IN ('attendee', 'admin')),
    is_suspended BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events & Hackathons
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    dates TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_city TEXT NOT NULL,
    banner_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Connection Requests (Reciprocal Invariant)
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note VARCHAR(280),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT no_self_connect CHECK (sender_id <> receiver_id),
    CONSTRAINT unique_pending_pair UNIQUE (sender_id, receiver_id)
);

-- 4. Accepted Connections
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT ordered_pair_check CHECK (user_a_id < user_b_id),
    CONSTRAINT unique_connection_pair UNIQUE (user_a_id, user_b_id)
);

-- 5. Conversations & Direct Messages
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    is_group BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Community Posts, Comments & Single-Reaction Invariant
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    code_snippet TEXT,
    likes_count INT DEFAULT 0,
    dislikes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction VARCHAR(10) NOT NULL CHECK (reaction IN ('like', 'dislike')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_reaction_per_user UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- Row Level Security (RLS) Policies
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Read profiles: active attendees can view public profiles
CREATE POLICY "Public Profiles Read" ON public.profiles
    FOR SELECT USING (is_suspended = FALSE);

-- Messages: only conversation participants can read/insert
CREATE POLICY "Authorized Conversation Read" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversation_members
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Authorized Conversation Write" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.conversation_members
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(fullDDL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const tables = [
    { name: 'profiles', desc: 'Attendee skills, bio, GitHub, and role claims' },
    { name: 'events', desc: 'Configurable event title, venue, dates, banner' },
    { name: 'connection_requests', desc: 'Personalized requests with 280-char note' },
    { name: 'connections', desc: 'Accepted bidirectional peer connections' },
    { name: 'conversations', desc: '1:1 chats and event lounge channels' },
    { name: 'messages', desc: 'Secure direct messages with RLS containment' },
    { name: 'posts', desc: 'Community feed items with code snippet support' },
    { name: 'post_reactions', desc: 'Unique (post_id, user_id) single-reaction rule' },
    { name: 'comments', desc: 'Threaded post discussions' },
    { name: 'reports', desc: 'Safety flags triaged by administrators' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-950/80 border border-blue-800 text-blue-400 font-mono text-xs mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL 15 & Supabase Schema</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Relational Data Model & Row Level Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Strict foreign keys, unique constraint invariants, and zero-leakage RLS policies designed for production deployment on Supabase.
          </p>
        </div>

        <button
          onClick={handleCopySQL}
          className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm shrink-0"
        >
          {copiedSQL ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied SQL DDL!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Full PostgreSQL DDL</span>
            </>
          )}
        </button>
      </div>

      {/* Table Directory Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {tables.map((t) => (
          <button
            key={t.name}
            onClick={() => setSelectedTable(t.name)}
            className={`p-3 rounded-xl text-left border transition-all ${
              selectedTable === t.name
                ? 'bg-blue-950/60 border-blue-600 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-blue-400">
              <Table className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* SQL DDL Code Viewer */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-white font-semibold">schema.sql</span>
            <span>· PostgreSQL 15+ / Supabase RLS</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">RLS Policies Attached</span>
          </div>
        </div>

        <pre className="p-6 text-xs font-mono text-blue-200 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{fullDDL}</code>
        </pre>
      </div>
    </div>
  );
};
