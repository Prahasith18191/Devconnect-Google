import React, { useState, useMemo } from 'react';
import { AttendeeProfile } from '../../types';
import { Search, Sparkles, UserPlus, Check, Clock, ExternalLink, MessageSquare, Filter } from 'lucide-react';

interface FrameDirectoryProps {
  attendees: AttendeeProfile[];
  onSelectProfile: (profile: AttendeeProfile) => void;
  onSendConnectionRequest: (attendeeId: string, note: string) => void;
  onNavigateToChat: (attendeeId: string) => void;
}

export const FrameDirectory: React.FC<FrameDirectoryProps> = ({
  attendees,
  onSelectProfile,
  onSendConnectionRequest,
  onNavigateToChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [activeStackFilters, setActiveStackFilters] = useState<string[]>(['FastAPI', 'Gemini API']);
  
  // Connection modal state
  const [connectingAttendee, setConnectingAttendee] = useState<AttendeeProfile | null>(null);
  const [connectionNote, setConnectionNote] = useState('');

  const availableTags = ['FastAPI', 'Gemini API', 'PostgreSQL', 'LangChain', 'Python 3.13', 'Google Cloud Run', 'React 19'];

  const toggleStackFilter = (tag: string) => {
    setActiveStackFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter and rank attendees by matching score
  const filteredAttendees = useMemo(() => {
    return attendees.map((attendee) => {
      // Calculate match score
      const sharedInterests = attendee.skills.concat(attendee.interests).filter((skill) =>
        activeStackFilters.some((filter) => skill.toLowerCase().includes(filter.toLowerCase()))
      );

      const score = Math.min(99, Math.round((sharedInterests.length / Math.max(1, activeStackFilters.length)) * 100));

      return {
        ...attendee,
        matchScore: score,
        mutualInterestsCount: sharedInterests.length,
        matchReasons: sharedInterests
      };
    }).filter((attendee) => {
      const matchesSearch =
        attendee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        selectedRole === 'All' ||
        (selectedRole === 'Backend' && attendee.headline.includes('Backend')) ||
        (selectedRole === 'ML/AI' && (attendee.headline.includes('ML') || attendee.headline.includes('AI'))) ||
        (selectedRole === 'Full-Stack' && attendee.headline.includes('Full-Stack')) ||
        (selectedRole === 'Cloud' && attendee.headline.includes('Cloud'));

      return matchesSearch && matchesRole;
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [attendees, searchQuery, selectedRole, activeStackFilters]);

  const handleOpenConnect = (attendee: AttendeeProfile) => {
    setConnectingAttendee(attendee);
    setConnectionNote(`Hey ${attendee.fullName.split(' ')[0]}! Saw you're working with ${attendee.skills[0] || 'AI'}. Would love to connect at the Hyderabad bootcamp!`);
  };

  const handleConfirmConnect = () => {
    if (connectingAttendee) {
      onSendConnectionRequest(connectingAttendee.id, connectionNote);
      setConnectingAttendee(null);
      setConnectionNote('');
    }
  };

  return (
    <div className="bg-slate-900 min-h-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header & Search Controls */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--ag-text)]">Attendee Directory & Matcher</h2>
          <p className="text-xs sm:text-sm text-[var(--ag-muted)]">
            Find builders attending Build with AI Hyderabad with shared technical interests and stacks.
          </p>
        </div>

        {/* Search Bar & Role Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[var(--ag-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, headline, company, or skills (e.g. FastAPI, pgvector)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-[var(--ag-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-lg border border-slate-700">
            {['All', 'Backend', 'ML/AI', 'Full-Stack', 'Cloud'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedRole === role
                    ? 'bg-blue-600 text-[var(--ag-text)]'
                    : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Matchmaker Strip */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-[var(--ag-text)]">Match with your stack:</span>
            <span className="text-xs text-[var(--ag-muted)]">Toggle filters to re-rank builders</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {availableTags.map((tag) => {
              const active = activeStackFilters.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleStackFilter(tag)}
                  className={`px-2.5 py-1 text-xs rounded-md font-mono transition-colors ${
                    active
                      ? 'bg-blue-600/80 text-[var(--ag-text)] border border-blue-400/60'
                      : 'bg-slate-800 text-[var(--ag-muted)] border border-slate-700 hover:text-[var(--ag-text)]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count & Match Summary */}
      <div className="flex items-center justify-between text-xs text-[var(--ag-muted)]">
        <span>Showing <strong className="text-[var(--ag-text)] font-mono">{filteredAttendees.length}</strong> bootcamp attendees</span>
        {activeStackFilters.length > 0 && (
          <span className="font-mono text-[var(--g-green)]">
            Ranking by mutual match with: {activeStackFilters.join(', ')}
          </span>
        )}
      </div>

      {/* Attendee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttendees.map((attendee) => {
          const isConnected = attendee.connectionStatus === 'connected';
          const isPending = attendee.connectionStatus === 'pending_sent';
          const isReceived = attendee.connectionStatus === 'pending_received';

          return (
            <div
              key={attendee.id}
              className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/70 hover:border-slate-600 transition-all flex flex-col justify-between gap-4 group"
            >
              {/* Profile Card Header */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={attendee.avatarUrl}
                    alt={attendee.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        onClick={() => onSelectProfile(attendee)}
                        className="text-sm font-semibold text-[var(--ag-text)] hover:text-blue-400 cursor-pointer truncate"
                      >
                        {attendee.fullName}
                      </h3>
                      {attendee.matchScore && attendee.matchScore > 50 && (
                        <span className="text-[11px] font-mono font-medium text-[var(--g-green)] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 shrink-0">
                          {attendee.matchScore}% Match
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--ag-muted)] truncate">{attendee.company}</div>
                    <div className="text-xs text-[var(--ag-muted)] line-clamp-2 mt-1 leading-snug">
                      {attendee.headline}
                    </div>
                  </div>
                </div>

                {/* Match Reason If Available */}
                {attendee.matchReasons && attendee.matchReasons.length > 0 && (
                  <div className="text-[11px] text-[var(--g-green)]/90 font-mono bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/40 truncate">
                    Both exploring: {attendee.matchReasons.slice(0, 3).join(', ')}
                  </div>
                )}

                {/* Unboxed Metadata / Skills with Typographic Separator (Anti-Slop rule) */}
                <div className="text-xs text-[var(--ag-muted)] leading-relaxed">
                  <span className="text-[var(--ag-faint)] font-mono text-[11px] uppercase mr-1">Skills:</span>
                  {attendee.skills.slice(0, 4).map((skill, idx, arr) => (
                    <React.Fragment key={skill}>
                      <span className="text-[var(--ag-muted)] font-medium">{skill}</span>
                      {idx < arr.length - 1 && <span className="mx-1 text-slate-600">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectProfile(attendee)}
                  className="text-xs font-medium text-[var(--ag-muted)] hover:text-[var(--ag-text)] flex items-center gap-1 transition-colors"
                >
                  <span>View Bio</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {isConnected ? (
                  <button
                    onClick={() => onNavigateToChat(attendee.id)}
                    className="px-3 py-1.5 text-xs font-medium text-[var(--ag-text)] bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                ) : isPending ? (
                  <button
                    disabled
                    className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-800/60 rounded-lg flex items-center gap-1.5 cursor-default"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Request Sent</span>
                  </button>
                ) : isReceived ? (
                  <button
                    onClick={() => onSendConnectionRequest(attendee.id, 'Accepted!')}
                    className="px-3 py-1.5 text-xs font-medium text-[var(--g-green)] bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/70 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Request</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenConnect(attendee)}
                    className="px-3 py-1.5 text-xs font-semibold text-[var(--ag-text)] bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Modal with Custom Note */}
      {connectingAttendee && (
        <div className="fixed inset-0 z-50 bg-[var(--ag-bg)]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <img
                src={connectingAttendee.avatarUrl}
                alt={connectingAttendee.fullName}
                className="w-12 h-12 rounded-lg object-cover border border-slate-600"
              />
              <div>
                <h3 className="text-base font-bold text-[var(--ag-text)]">Connect with {connectingAttendee.fullName}</h3>
                <p className="text-xs text-[var(--ag-muted)]">{connectingAttendee.headline}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ag-muted)]">
                Add a personal note (explaining why you want to connect):
              </label>
              <textarea
                value={connectionNote}
                onChange={(e) => setConnectionNote(e.target.value)}
                rows={3}
                maxLength={280}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-[var(--ag-text)] placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
              />
              <div className="flex justify-between text-[11px] text-[var(--ag-faint)] font-mono">
                <span>Recipient will receive in-app and SMTP email alert</span>
                <span>{connectionNote.length}/280</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConnectingAttendee(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConnect}
                className="px-4 py-2 text-xs font-semibold text-[var(--ag-text)] bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
