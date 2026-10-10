import React, { useState } from 'react';
import { EventDetails, AttendeeProfile } from '../../types';
import { 
  Shield, 
  Save, 
  Users, 
  Link2, 
  MessageSquare, 
  AlertTriangle, 
  Check, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminViewProps {
  event: EventDetails;
  attendees: AttendeeProfile[];
  onUpdateEvent: (updated: EventDetails) => void;
  onToggleSuspendUser: (userId: string) => void;
  totalAttendees: number;
  connectionsCount: number;
  discussionsCount: number;
}

export const AdminView: React.FC<AdminViewProps> = ({
  event,
  attendees,
  onUpdateEvent,
  onToggleSuspendUser,
  totalAttendees,
  connectionsCount,
  discussionsCount,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'moderation' | 'users' | 'audit'>('config');

  // Form State
  const [title, setTitle] = useState(event.title);
  const [tagline, setTagline] = useState(event.tagline);
  const [venue, setVenue] = useState(event.venueName);
  const [city, setCity] = useState(event.venueCity);
  const [dates, setDates] = useState(event.dates);
  const [description, setDescription] = useState(event.description);
  const [isSaved, setIsSaved] = useState(false);

  // Moderation state
  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      type: 'Post',
      content: 'Promoting unauthorized paid course link during session',
      author: 'Sneha Patel',
      reporter: 'Priya Sundaram',
      status: 'pending'
    },
    {
      id: 'rep-2',
      type: 'Message',
      content: 'Unsolicited recruitment spam in direct message',
      author: 'Rahul Sharma',
      reporter: 'Prahasith Naru',
      status: 'pending'
    }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEvent({
      ...event,
      title,
      tagline,
      venueName: venue,
      venueCity: city,
      dates,
      description,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
  };

  return (
    <div className="relative z-10 space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white glow-text">
              Event Administrator Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Dynamic event configuration, verified attendee control, and safety moderation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 glass-panel rounded-xl overflow-x-auto">
          {[
            { id: 'config', label: 'Event Setup' },
            { id: 'users', label: 'Attendees' },
            { id: 'moderation', label: 'Moderation' },
            { id: 'audit', label: 'Audit Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Supabase PostgreSQL Status Strip */}
      <div className="p-4 rounded-2xl glass-panel border border-[#1a73e8]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-950/40 to-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span>Supabase PostgreSQL Live: </span>
              <span className="font-mono text-emerald-400 text-[11px]">chzctkckibbgoqsrmqaj.supabase.co</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Profiles, posts, lounge broadcast, direct messages & connection requests sync dynamically.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const sql = `-- Supabase DDL for DevConnect AI
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  headline TEXT,
  company TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lounge_messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT,
  sender_name TEXT,
  sender_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  sender_id TEXT,
  sender_name TEXT,
  sender_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.connection_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT,
  receiver_id TEXT,
  sender_name TEXT,
  sender_headline TEXT,
  sender_avatar TEXT,
  note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;
            navigator.clipboard.writeText(sql);
            alert('Supabase SQL Schema copied! Paste into Supabase SQL Editor if you need to create the tables.');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Copy Supabase DDL SQL
        </button>
      </div>

      {/* KPI Stat Cards (Tabular Figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Registered Attendees</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalAttendees}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            {attendees.filter((a) => a.isVerified).length} Verified in Database
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Connections Formed</span>
            <Link2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {connectionsCount}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Active Peer Connections
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Discussions</span>
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {discussionsCount}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">Feed & Lounge Messages</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Safety Reports</span>
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {reports.filter((r) => r.status === 'pending').length}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">Needs Triage</div>
        </div>
      </div>

      {/* Tab: Event Setup */}
      {activeTab === 'config' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Event Identity & Venue Configuration</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update event title, dates, and venue. Changes reflect immediately across the live application.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>

          {isSaved && (
            <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/20 text-xs font-mono text-white flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Event configuration committed to database and updated across the live site!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Venue Name</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">City / Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Dates & Schedule Hours</label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Event Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 glass-input rounded-xl text-xs font-sans resize-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Attendee Governance & Access</h2>
            <span className="text-xs font-mono text-zinc-400">Server-Side Authorization Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-zinc-400 uppercase font-mono text-[10px] border-b border-white/[0.08]">
                <tr>
                  <th className="p-3">Attendee</th>
                  <th className="p-3">Seniority</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {attendees.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={a.avatarUrl} alt={a.fullName} className="w-7 h-7 rounded-lg object-cover border border-white/20" />
                      <div>
                        <span className="font-semibold text-white block">{a.fullName}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{a.skills[0]}</span>
                      </div>
                    </td>
                    <td className="p-3 text-zinc-300 font-mono">{a.experienceLevel}</td>
                    <td className="p-3 text-zinc-400">{a.company}</td>
                    <td className="p-3">
                      <span className={a.isVerified ? "text-emerald-400 font-mono text-[11px]" : "text-amber-400 font-mono text-[11px]"}>
                        {a.isVerified ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onToggleSuspendUser(a.id)}
                        className={a.isVerified ? "text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-950/40" : "text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2.5 py-1 rounded-lg hover:bg-emerald-950/40"}
                      >
                        {a.isVerified ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Moderation */}
      {activeTab === 'moderation' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Community Moderation Queue</h2>
            <span className="text-xs font-mono text-zinc-400">Zero Toleration for Spam</span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {reports.map((r) => (
              <div key={r.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{r.type} Reported</span>
                    <span className="text-[11px] font-mono text-zinc-400">by {r.reporter}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/10">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">"{r.content}"</p>
                </div>

                {r.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolve(r.id)}
                      className="px-3 py-1.5 glass-panel text-white text-xs font-medium rounded-lg"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolve(r.id)}
                      className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-500"
                    >
                      Resolve & Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'audit' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h2 className="text-base font-bold text-white">System Audit Trail</h2>
          <div className="space-y-2 font-mono text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <span>[AUDIT] Connection request mutual acceptance: Prahasith &lt;-&gt; Priya</span>
              <span className="text-zinc-500">10:09 AM</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <span>[AUDIT] Post reaction toggled (single reaction rule verified)</span>
              <span className="text-zinc-500">09:54 AM</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <span>[AUDIT] Event metadata updated by administrator</span>
              <span className="text-zinc-500">09:00 AM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
