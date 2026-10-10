-- ============================================================================
-- DevConnect AI — production schema (auth-linked, RLS, storage, auto-provision)
-- Safe to re-run. Admin = prahasith.naru@kellton.com only; everyone else attendee.
-- ============================================================================

-- Clean the old mock schema (TEXT ids, no auth link, no RLS)
drop table if exists public.post_comments     cascade;
drop table if exists public.post_reactions    cascade;
drop table if exists public.posts             cascade;
drop table if exists public.messages          cascade;
drop table if exists public.lounge_messages   cascade;
drop table if exists public.connection_requests cascade;
drop table if exists public.event_photos      cascade;
drop table if exists public.profiles          cascade;
drop table if exists public.events            cascade;

-- ── profiles (1:1 with auth.users) ──────────────────────────────────────────
create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text not null,
  full_name        text not null default '',
  headline         text default '',
  company          text default '',
  job_title        text default '',
  avatar_url       text default '',
  bio              text default '',
  skills           text[] default '{}',
  interests        text[] default '{}',
  learning         text[] default '{}',
  experience_years int default 0,
  experience_level text default 'Mid',
  github_url       text, linkedin_url text, website_url text,
  role             text not null default 'attendee' check (role in ('attendee','admin')),
  status           text not null default 'active'   check (status in ('active','suspended')),
  is_verified      boolean not null default true,
  created_at       timestamptz not null default now()
);

create table public.events (
  id text primary key default 'devconnect',
  slug text, title text, tagline text, description text, dates text,
  venue_name text, venue_city text, organizer text,
  attendee_count int default 0, sessions_count int default 4, tracks_count int default 3,
  updated_at timestamptz default now()
);

create table public.event_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null, caption text default '', sort_order int default 0,
  created_at timestamptz default now()
);

create table public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  note text default '',
  status text not null default 'pending' check (status in ('pending','accepted','rejected','cancelled')),
  created_at timestamptz not null default now(),
  unique (sender_id, receiver_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.lounge_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  code_snippet text, media_url text,
  likes_count int default 0, dislikes_count int default 0, comments_count int default 0,
  created_at timestamptz not null default now()
);

create table public.post_reactions (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  reaction text check (reaction in ('like','dislike')),
  primary key (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ── admin helper (SECURITY DEFINER avoids RLS recursion) ────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ── auto-provision a profile on signup ──────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, headline, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'headline', ''),
    case when lower(new.email) = 'prahasith.naru@kellton.com' then 'admin' else 'attendee' end
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for already-registered users (2 exist)
insert into public.profiles (id, email, full_name, role)
select u.id, u.email,
       coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1)),
       case when lower(u.email) = 'prahasith.naru@kellton.com' then 'admin' else 'attendee' end
from auth.users u
on conflict (id) do update set
  role = case when lower(excluded.email) = 'prahasith.naru@kellton.com' then 'admin' else public.profiles.role end;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.events              enable row level security;
alter table public.event_photos        enable row level security;
alter table public.connection_requests enable row level security;
alter table public.messages            enable row level security;
alter table public.lounge_messages     enable row level security;
alter table public.posts               enable row level security;
alter table public.post_reactions      enable row level security;
alter table public.post_comments       enable row level security;

-- profiles: everyone signed-in sees the directory; you edit your own; admin edits anyone
create policy prof_sel on public.profiles for select to authenticated using (true);
create policy prof_upd_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy prof_upd_admin on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- events + photos: public read; admin writes
create policy ev_sel on public.events for select using (true);
create policy ev_upd on public.events for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy ev_ins on public.events for insert to authenticated with check (public.is_admin());
create policy evp_sel on public.event_photos for select using (true);
create policy evp_all on public.event_photos for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- connection requests: the two parties (or admin) see it; sender creates; receiver/sender/admin update
create policy cr_sel on public.connection_requests for select to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin());
create policy cr_ins on public.connection_requests for insert to authenticated with check (sender_id = auth.uid());
create policy cr_upd on public.connection_requests for update to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin());

-- direct messages: only participants (+admin)
create policy msg_sel on public.messages for select to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin());
create policy msg_ins on public.messages for insert to authenticated with check (sender_id = auth.uid());

-- lounge: all signed-in read; you post as yourself
create policy lng_sel on public.lounge_messages for select to authenticated using (true);
create policy lng_ins on public.lounge_messages for insert to authenticated with check (sender_id = auth.uid());

-- posts + reactions + comments
create policy post_sel on public.posts for select to authenticated using (true);
create policy post_ins on public.posts for insert to authenticated with check (author_id = auth.uid());
create policy post_upd on public.posts for update to authenticated using (author_id = auth.uid() or public.is_admin());
create policy post_del on public.posts for delete to authenticated using (author_id = auth.uid() or public.is_admin());
create policy rx_sel on public.post_reactions for select to authenticated using (true);
create policy rx_all on public.post_reactions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy pc_sel on public.post_comments for select to authenticated using (true);
create policy pc_ins on public.post_comments for insert to authenticated with check (author_id = auth.uid());

-- ── storage buckets (avatars, post media) + policies ────────────────────────
insert into storage.buckets (id, name, public) values ('avatars','avatars',true)
  on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public) values ('post-media','post-media',true)
  on conflict (id) do update set public = true;

drop policy if exists sto_read on storage.objects;
drop policy if exists sto_write on storage.objects;
drop policy if exists sto_update on storage.objects;
drop policy if exists sto_delete on storage.objects;
create policy sto_read   on storage.objects for select using (bucket_id in ('avatars','post-media'));
create policy sto_write  on storage.objects for insert to authenticated with check (bucket_id in ('avatars','post-media'));
create policy sto_update on storage.objects for update to authenticated using (bucket_id in ('avatars','post-media'));
create policy sto_delete on storage.objects for delete to authenticated using (bucket_id in ('avatars','post-media'));

-- ── seed the event singleton (no fake attendees) ────────────────────────────
insert into public.events (id, slug, title, tagline, description, dates, venue_name, venue_city, organizer, sessions_count, tracks_count)
values ('devconnect','build-with-ai-hyderabad',
  'Build with AI: Cloud Agentic AI & Antigravity Workshop',
  'Event networking & developer community platform',
  'Connect with developers and technology leaders at Build with AI, Hyderabad — hands-on agentic AI and cloud sessions.',
  'Today · 9:00 AM – 1:00 PM IST', 'Cohort Coworkspaces', 'Hyderabad',
  'Google for Developers · Hack2Skill', 4, 3)
on conflict (id) do nothing;

-- realtime for chat
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.lounge_messages;
alter publication supabase_realtime add table public.connection_requests;
alter publication supabase_realtime add table public.posts;
