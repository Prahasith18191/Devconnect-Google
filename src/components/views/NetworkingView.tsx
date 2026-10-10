import React, { useState, useMemo } from 'react';
import { AttendeeProfile } from '../../types';
import { 
  Search, 
  Sparkles, 
  UserPlus, 
  Check, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';

interface NetworkingViewProps {
  attendees: AttendeeProfile[];
  currentUserId?: string;
  onOpenProfile: (profile: AttendeeProfile) => void;
  onOpenConnectModal: (attendee: AttendeeProfile) => void;
  onAcceptConnection: (attendeeId: string) => void;
  onNavigateToChat: (attendeeId: string) => void;
}

export const NetworkingView: React.FC<NetworkingViewProps> = ({
  attendees,
  currentUserId = 'usr-1',
  onOpenProfile,
  onOpenConnectModal,
  onAcceptConnection,
  onNavigateToChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [activeStackFilters, setActiveStackFilters] = useState<string[]>([
    'Cloud Agents', 
    'Antigravity'
  ]);

  const availableTags = [
    'Cloud Agents',
    'Antigravity',
    'Python',
    'FastAPI',
    'PostgreSQL',
    'Vector Search',
    'React',
    'Cloud Architecture',
  ];

  const toggleStackTag = (tag: string) => {
    setActiveStackFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const rankedAttendees = useMemo(() => {
    return attendees
      .map((attendee) => {
        const sharedInterests = (attendee.skills || [])
          .concat(attendee.interests || [])
          .filter((skill) =>
            activeStackFilters.some((f) =>
              skill.toLowerCase().includes(f.toLowerCase())
            )
          );

        const maxFilters = Math.max(1, activeStackFilters.length);
        const score = Math.min(
          99,
          Math.round((sharedInterests.length / maxFilters) * 85) + 14
        );

        return {
          ...attendee,
          calculatedScore: activeStackFilters.length > 0 ? score : 0,
          sharedInterests,
        };
      })
      .filter((attendee) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          attendee.fullName.toLowerCase().includes(q) ||
          attendee.headline.toLowerCase().includes(q) ||
          attendee.company.toLowerCase().includes(q) ||
          (attendee.skills || []).some((s) => s.toLowerCase().includes(q));

        const matchesRole =
          selectedRole === 'All' ||
          (selectedRole === 'Backend' && attendee.headline.includes('Backend')) ||
          (selectedRole === 'AI & Cloud' && (attendee.headline.includes('ML') || attendee.headline.includes('AI') || attendee.headline.includes('Cloud'))) ||
          (selectedRole === 'Full-Stack' && attendee.headline.includes('Full-Stack'));

        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        // Current user pinned or top, then highest score
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return (b.calculatedScore || 0) - (a.calculatedScore || 0);
      });
  }, [attendees, searchQuery, selectedRole, activeStackFilters, currentUserId]);

  return (
    <div className="relative z-10 space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ag-text)]">
                Attendees & Networking
              </h1>
              <span className="text-[11px] font-mono bg-emerald-500/10 text-[var(--g-green)] border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Database Sync</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ag-muted)] mt-1">
              Connect with fellow developers and technology practitioners attending today's workshop.
            </p>
          </div>

          <div className="text-xs text-[var(--ag-muted)] font-medium flex items-center gap-2">
            <span className="font-mono text-[var(--ag-text)] bg-[var(--ag-surface)] px-2 py-0.5 rounded-md font-semibold">
              {rankedAttendees.length}
            </span>
            <span>Registered Attendees</span>
          </div>
        </div>

        {/* Search Bar & Role Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[var(--ag-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, or tech skills..."
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs sm:text-sm placeholder-zinc-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1 p-1 glass-panel rounded-xl">
            {['All', 'Backend', 'AI & Cloud', 'Full-Stack'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedRole === role
                    ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                    : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Matcher Bar */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--ag-text)] shrink-0" />
            <span className="text-xs font-semibold text-[var(--ag-text)]">Filter by technical interests:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {availableTags.map((tag) => {
              const active = activeStackFilters.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleStackTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                      : 'bg-[var(--ag-surface)] text-[var(--ag-muted)] hover:text-[var(--ag-text)] border border-[var(--ag-border)]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attendee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rankedAttendees.map((attendee) => {
          const isConnected = attendee.connectionStatus === 'connected';
          const isPending = attendee.connectionStatus === 'pending_sent';
          const isReceived = attendee.connectionStatus === 'pending_received';
          const isSelf = attendee.id === currentUserId;

          return (
            <motion.div
              key={attendee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between gap-5 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={attendee.avatarUrl}
                    alt={attendee.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-[var(--ag-border)] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        onClick={() => onOpenProfile(attendee)}
                        className="text-sm font-bold text-[var(--ag-text)] hover:underline cursor-pointer truncate"
                      >
                        {attendee.fullName}
                      </h3>
                      {attendee.calculatedScore > 40 && (
                        <span className="text-[11px] font-semibold text-[var(--ag-text)] bg-[var(--ag-card)]/[0.1] px-2 py-0.5 rounded-md border border-[var(--ag-border)] shrink-0">
                          {attendee.calculatedScore}% Match
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--ag-muted)] truncate mt-0.5">{attendee.company}</div>
                    <div className="text-xs text-[var(--ag-muted)] line-clamp-2 mt-1 leading-snug">
                      {attendee.headline}
                    </div>
                  </div>
                </div>

                {/* Skills & Focus */}
                <div className="text-xs text-[var(--ag-muted)] leading-relaxed pt-1">
                  <span className="text-[var(--ag-faint)] text-[11px] uppercase mr-1.5 font-medium">Focus:</span>
                  {(attendee.skills || []).slice(0, 4).map((skill, idx, arr) => (
                    <span key={skill}>
                      <span className={activeStackFilters.includes(skill) ? 'text-[var(--ag-text)] font-semibold' : 'text-[var(--ag-muted)]'}>
                        {skill}
                      </span>
                      {idx < arr.length - 1 && <span className="mx-1 text-[var(--ag-faint)]">·</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[var(--ag-border)] flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenProfile(attendee)}
                  className="text-xs font-medium text-[var(--ag-muted)] hover:text-[var(--ag-text)] flex items-center gap-1 transition-colors"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {isSelf ? (
                  <span className="text-xs font-semibold text-[var(--g-green)] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    You (Active Profile)
                  </span>
                ) : isConnected ? (
                  <button
                    onClick={() => onNavigateToChat(attendee.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ag-text)] bg-[var(--ag-card)]/[0.1] hover:bg-[var(--ag-card)] hover:text-[var(--ag-text)] border border-[var(--ag-border)] rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                ) : isReceived ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAcceptConnection(attendee.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-[var(--ag-text)] bg-[var(--ag-card)] hover:opacity-90 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => onNavigateToChat(attendee.id)}
                      className="p-1.5 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg hover:bg-[var(--ag-surface)]"
                      title="Direct Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 text-xs text-[var(--ag-muted)] bg-[var(--ag-surface)] border border-[var(--ag-border)] rounded-xl flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--ag-muted)]" />
                      <span>Pending</span>
                    </div>
                    <button
                      onClick={() => onAcceptConnection(attendee.id)}
                      className="px-2.5 py-1 text-xs font-medium text-[var(--g-green)] hover:text-[var(--g-green)] bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                      title="Confirm Connection"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => onNavigateToChat(attendee.id)}
                      className="p-1.5 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg hover:bg-[var(--ag-surface)]"
                      title="Direct Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenConnectModal(attendee)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ag-text)] bg-[var(--ag-surface)] hover:bg-[var(--ag-card)] hover:text-[var(--ag-text)] border border-[var(--ag-border)] rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                    <button
                      onClick={() => onNavigateToChat(attendee.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[var(--ag-muted)] hover:text-[var(--ag-text)] bg-[var(--ag-surface)] hover:bg-[var(--ag-card)]/[0.1] border border-[var(--ag-border)] rounded-xl flex items-center gap-1.5 transition-all"
                      title="Direct Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
