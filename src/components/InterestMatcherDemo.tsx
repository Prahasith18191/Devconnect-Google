import React, { useState, useMemo } from 'react';
import { AttendeeProfile } from '../types';
import { Sparkles, UserPlus, Check, ExternalLink, Code2, Cpu } from 'lucide-react';

interface InterestMatcherDemoProps {
  attendees: AttendeeProfile[];
  onSendConnectionRequest: (attendeeId: string, note: string) => void;
  onSelectProfile: (profile: AttendeeProfile) => void;
}

export const InterestMatcherDemo: React.FC<InterestMatcherDemoProps> = ({
  attendees,
  onSendConnectionRequest,
  onSelectProfile,
}) => {
  // User's active stack preferences
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python 3.13', 'FastAPI', 'Gemini API', 'PostgreSQL']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['AI Agent Frameworks', 'Vector Retrieval']);

  const allSkills = [
    'Python 3.13',
    'FastAPI',
    'PostgreSQL',
    'Gemini API',
    'LangChain',
    'React 19',
    'Docker',
    'Google Cloud Run',
    'PyTorch',
    'TypeScript',
  ];

  const allInterests = [
    'AI Agent Frameworks',
    'Vector Retrieval',
    'High-throughput APIs',
    'PostgreSQL RLS',
    'Prompt Engineering',
    'Real-time Apps',
  ];

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleInterest = (i: string) => {
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((item) => item !== i) : [...prev, i]
    );
  };

  // Algorithmic Match Ranking
  const rankedAttendees = useMemo(() => {
    return attendees
      .filter((a) => a.id !== 'usr-1') // exclude self
      .map((attendee) => {
        const matchingSkills = attendee.skills.filter((sk) =>
          selectedSkills.some((s) => sk.toLowerCase().includes(s.toLowerCase()))
        );

        const matchingInterests = attendee.interests.filter((intr) =>
          selectedInterests.some((i) => intr.toLowerCase().includes(i.toLowerCase()))
        );

        const totalMatches = matchingSkills.length * 1.5 + matchingInterests.length * 2;
        const maxScorePossible = (selectedSkills.length * 1.5 + selectedInterests.length * 2) || 1;
        const score = Math.min(99, Math.max(25, Math.round((totalMatches / maxScorePossible) * 100)));

        return {
          ...attendee,
          matchScore: score,
          matchingSkills,
          matchingInterests,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [attendees, selectedSkills, selectedInterests]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-mono text-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Algorithmic Matchmaking Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ag-text)] tracking-tight">
          Developer Technical Interest Matcher
        </h2>
        <p className="text-xs sm:text-sm text-[var(--ag-muted)] mt-1 max-w-2xl">
          DevConnect AI calculates semantic overlap across technical stack, database choices, and AI exploration goals to connect developers with the highest collaboration potential.
        </p>
      </div>

      {/* Interactive Controls: User's Profile Config */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--ag-text)] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Configure Your Current Builder Stack & Goals</span>
          </h3>
          <span className="text-xs font-mono text-[var(--ag-muted)]">Live Scored</span>
        </div>

        {/* Skill Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[var(--ag-muted)]">1. Your Core Tech Stack:</span>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    active
                      ? 'bg-blue-600 text-[var(--ag-text)] shadow-xs'
                      : 'bg-slate-800 text-[var(--ag-muted)] hover:text-[var(--ag-text)] border border-slate-700'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interest Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[var(--ag-muted)]">2. What are you building or researching today?</span>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    active
                      ? 'bg-emerald-600 text-[var(--ag-text)] shadow-xs'
                      : 'bg-slate-800 text-[var(--ag-muted)] hover:text-[var(--ag-text)] border border-slate-700'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ranked Match Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[var(--ag-muted)]">
          <span>Ranked peer recommendations for Hyderabad Bootcamp</span>
          <span className="font-mono text-[var(--g-green)]">
            {rankedAttendees.filter((a) => a.matchScore >= 70).length} High-Affinity Matches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankedAttendees.map((peer) => (
            <div
              key={peer.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={peer.avatarUrl}
                    alt={peer.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        onClick={() => onSelectProfile(peer)}
                        className="text-sm font-bold text-[var(--ag-text)] hover:text-blue-400 cursor-pointer truncate"
                      >
                        {peer.fullName}
                      </h4>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800 text-[var(--g-green)] font-mono text-xs font-bold">
                        <span>{peer.matchScore}%</span>
                        <span className="text-[10px] text-[var(--g-green)] font-normal">Match</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--ag-muted)] truncate">{peer.headline}</p>
                    <p className="text-[11px] text-[var(--ag-faint)] font-mono mt-0.5">{peer.company}</p>
                  </div>
                </div>

                {/* Match Reason Pills */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="text-[var(--g-green)] font-mono text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Why you should connect:</span>
                  </div>
                  <div className="text-[var(--ag-muted)] text-[11px] leading-relaxed">
                    {peer.matchingSkills.length > 0 && (
                      <div>
                        Shared Stacks: <strong className="text-[var(--ag-text)]">{peer.matchingSkills.join(', ')}</strong>
                      </div>
                    )}
                    {peer.matchingInterests.length > 0 && (
                      <div className="text-[var(--ag-muted)]">
                        Mutual Focus: <strong className="text-[var(--g-green)]">{peer.matchingInterests.join(', ')}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills unboxed with dots */}
                <div className="text-xs text-[var(--ag-muted)]">
                  {peer.skills.map((skill, idx, arr) => (
                    <span key={skill}>
                      <span className={peer.matchingSkills.includes(skill) ? 'text-blue-300 font-semibold' : 'text-[var(--ag-muted)]'}>
                        {skill}
                      </span>
                      {idx < arr.length - 1 && <span className="mx-1 text-slate-600">·</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectProfile(peer)}
                  className="text-xs text-[var(--ag-muted)] hover:text-[var(--ag-text)] flex items-center gap-1"
                >
                  <span>View Projects & Bio</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {peer.connectionStatus === 'connected' ? (
                  <span className="text-xs font-mono text-[var(--g-green)] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      onSendConnectionRequest(
                        peer.id,
                        `Hey ${peer.fullName.split(' ')[0]}! Saw we're both building with ${selectedSkills[0]} at the bootcamp. Let's connect!`
                      )
                    }
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-[var(--ag-text)] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Quick Connect</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
