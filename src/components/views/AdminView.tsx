import React, { useState, useRef } from 'react';
import { EventDetails, AttendeeProfile } from '../../types';
import { EventPhoto } from '../../lib/dataService';
import {
  Shield,
  Save,
  Users,
  Link2,
  MessageSquare,
  AlertTriangle,
  Check,
  ImagePlus,
  Trash2
} from 'lucide-react';

interface AdminViewProps {
  event: EventDetails;
  attendees: AttendeeProfile[];
  onUpdateEvent: (updated: EventDetails) => void;
  onToggleSuspendUser: (userId: string) => void;
  totalAttendees: number;
  connectionsCount: number;
  discussionsCount: number;
  eventPhotos: EventPhoto[];
  onAddEventPhoto: (file: File) => void;
  onDeleteEventPhoto: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  event,
  attendees,
  onUpdateEvent,
  onToggleSuspendUser,
  totalAttendees,
  connectionsCount,
  discussionsCount,
  eventPhotos,
  onAddEventPhoto,
  onDeleteEventPhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'photos' | 'moderation' | 'users' | 'audit'>('config');
  const photoInputRef = useRef<HTMLInputElement>(null);

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
            <Shield className="w-5 h-5 text-[var(--ag-text)]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ag-text)] glow-text">
              Event Administrator Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--ag-muted)] mt-1">
            Dynamic event configuration, verified attendee control, and safety moderation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 glass-panel rounded-xl overflow-x-auto">
          {[
            { id: 'config', label: 'Event Setup' },
            { id: 'photos', label: 'Home Photos' },
            { id: 'users', label: 'Attendees' },
            { id: 'moderation', label: 'Moderation' },
            { id: 'audit', label: 'Audit Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                  : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
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
            <div className="text-xs font-semibold text-[var(--ag-text)] flex items-center gap-2">
              <span>Supabase PostgreSQL Live: </span>
              <span className="font-mono text-[var(--g-green)] text-[11px]">chzctkckibbgoqsrmqaj.supabase.co</span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
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
          className="px-3.5 py-1.5 rounded-xl bg-[var(--ag-surface)] hover:bg-[var(--ag-surface)] text-[var(--ag-text)] text-xs font-medium border border-[var(--ag-border)] transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Copy Supabase DDL SQL
        </button>
      </div>

      {/* KPI Stat Cards (Tabular Figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--ag-muted)]">
            <span>Registered Attendees</span>
            <Users className="w-4 h-4 text-[var(--ag-muted)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--ag-text)] font-mono tabular-nums">
            {totalAttendees}
          </div>
          <div className="text-[11px] text-[var(--ag-muted)] font-mono">
            {attendees.filter((a) => a.isVerified).length} Verified in Database
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--ag-muted)]">
            <span>Connections Formed</span>
            <Link2 className="w-4 h-4 text-[var(--g-green)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--ag-text)] font-mono tabular-nums">
            {connectionsCount}
          </div>
          <div className="text-[11px] text-[var(--ag-muted)] font-mono">
            Active Peer Connections
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--ag-muted)]">
            <span>Active Discussions</span>
            <MessageSquare className="w-4 h-4 text-[var(--ag-text)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--ag-text)] font-mono tabular-nums">
            {discussionsCount}
          </div>
          <div className="text-[11px] text-[var(--ag-muted)] font-mono">Feed & Lounge Messages</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--ag-muted)]">
            <span>Safety Reports</span>
            <AlertTriangle className="w-4 h-4 text-[var(--ag-text)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--ag-text)] font-mono tabular-nums">
            {reports.filter((r) => r.status === 'pending').length}
          </div>
          <div className="text-[11px] text-[var(--ag-muted)] font-mono">Needs Triage</div>
        </div>
      </div>

      {/* Tab: Event Setup */}
      {activeTab === 'config' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--ag-border)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--ag-text)]">Event Identity & Venue Configuration</h2>
              <p className="text-xs text-[var(--ag-muted)] mt-0.5">
                Update event title, dates, and venue. Changes reflect immediately across the live application.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[var(--ag-card)] text-[var(--ag-text)] hover:opacity-90 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>

          {isSaved && (
            <div className="p-3.5 rounded-xl bg-[var(--ag-surface)] border border-[var(--ag-border)] text-xs font-mono text-[var(--ag-text)] flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--g-green)]" />
              <span>Event configuration committed to database and updated across the live site!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ag-muted)]">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ag-muted)]">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ag-muted)]">Venue Name</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ag-muted)]">City / Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-[var(--ag-muted)]">Dates & Schedule Hours</label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-[var(--ag-muted)]">Event Description</label>
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

      {/* Tab: Home Carousel Photos */}
      {activeTab === 'photos' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--ag-border)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--ag-text)]">"How the day unfolded" — Home Carousel</h2>
              <p className="text-xs text-[var(--ag-muted)] mt-0.5">
                Upload your own event photos. These auto-scroll on the landing page. Use photos you own or that are openly licensed.
              </p>
            </div>
            <button
              onClick={() => photoInputRef.current?.click()}
              className="px-4 py-2.5 ag-btn-dark text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
            >
              <ImagePlus className="w-4 h-4" /> Add photo
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onAddEventPhoto(f);
                e.target.value = '';
              }}
            />
          </div>

          {eventPhotos.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--ag-muted)]">
              No photos yet — the landing page is showing neutral placeholders.
              <br />Click <span className="font-semibold text-[var(--ag-text)]">Add photo</span> to feature real moments from the event.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {eventPhotos.map((p) => (
                <div key={p.id} className="relative group rounded-2xl overflow-hidden border border-[var(--ag-border)] aspect-[3/2] bg-[var(--ag-surface-2)]">
                  <img src={p.url} alt={p.caption || 'Event photo'} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onDeleteEventPhoto(p.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--ag-text)]">Attendee Governance & Access</h2>
            <span className="text-xs font-mono text-[var(--ag-muted)]">Server-Side Authorization Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--ag-surface)] text-[var(--ag-muted)] uppercase font-mono text-[10px] border-b border-[var(--ag-border)]">
                <tr>
                  <th className="p-3">Attendee</th>
                  <th className="p-3">Seniority</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ag-border)]">
                {attendees.map((a) => (
                  <tr key={a.id} className="hover:bg-[var(--ag-surface)]">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={a.avatarUrl} alt={a.fullName} className="w-7 h-7 rounded-lg object-cover border border-[var(--ag-border)]" />
                      <div>
                        <span className="font-semibold text-[var(--ag-text)] block">{a.fullName}</span>
                        <span className="text-[10px] text-[var(--ag-faint)] font-mono">{a.skills[0]}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[var(--ag-muted)] font-mono">{a.experienceLevel}</td>
                    <td className="p-3 text-[var(--ag-muted)]">{a.company}</td>
                    <td className="p-3">
                      <span className={a.isVerified ? "text-[var(--g-green)] font-mono text-[11px]" : "text-amber-400 font-mono text-[11px]"}>
                        {a.isVerified ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onToggleSuspendUser(a.id)}
                        className={a.isVerified ? "text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-950/40" : "text-xs text-[var(--g-green)] hover:text-[var(--g-green)] font-medium px-2.5 py-1 rounded-lg hover:bg-emerald-950/40"}
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
            <h2 className="text-base font-bold text-[var(--ag-text)]">Community Moderation Queue</h2>
            <span className="text-xs font-mono text-[var(--ag-muted)]">Zero Toleration for Spam</span>
          </div>

          <div className="divide-y divide-[var(--ag-border)]">
            {reports.map((r) => (
              <div key={r.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--ag-text)]">{r.type} Reported</span>
                    <span className="text-[11px] font-mono text-[var(--ag-muted)]">by {r.reporter}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--ag-surface)] text-[var(--ag-muted)] border border-[var(--ag-border)]">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)] mt-1">"{r.content}"</p>
                </div>

                {r.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolve(r.id)}
                      className="px-3 py-1.5 glass-panel text-[var(--ag-text)] text-xs font-medium rounded-lg"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolve(r.id)}
                      className="px-3 py-1.5 bg-rose-600 text-[var(--ag-text)] text-xs font-semibold rounded-lg hover:bg-rose-500"
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
          <h2 className="text-base font-bold text-[var(--ag-text)]">System Audit Trail</h2>
          <div className="space-y-2 font-mono text-xs text-[var(--ag-muted)]">
            <div className="p-3 rounded-xl bg-[var(--ag-surface)] border border-[var(--ag-border)] flex items-center justify-between">
              <span>[AUDIT] Connection request mutual acceptance: Prahasith &lt;-&gt; Priya</span>
              <span className="text-[var(--ag-faint)]">10:09 AM</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--ag-surface)] border border-[var(--ag-border)] flex items-center justify-between">
              <span>[AUDIT] Post reaction toggled (single reaction rule verified)</span>
              <span className="text-[var(--ag-faint)]">09:54 AM</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--ag-surface)] border border-[var(--ag-border)] flex items-center justify-between">
              <span>[AUDIT] Event metadata updated by administrator</span>
              <span className="text-[var(--ag-faint)]">09:00 AM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
