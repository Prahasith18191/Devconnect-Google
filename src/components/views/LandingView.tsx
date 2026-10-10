import React from 'react';
import { EventDetails, AgendaItem } from '../../types';
import { Calendar, MapPin, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { KineticText } from '../KineticText';
import { MagneticButton } from '../MagneticButton';

interface LandingViewProps {
  event: EventDetails;
  agenda: AgendaItem[];
  onExploreNetworking: () => void;
  onJoinLounge: () => void;
  totalAttendees: number;
  /** Admin-managed "how the event went" photos. Falls back to placeholders. */
  eventPhotos?: string[];
}

const DEFAULT_PHOTOS = [
  'https://picsum.photos/seed/devconnect-a/640/430',
  'https://picsum.photos/seed/devconnect-b/640/430',
  'https://picsum.photos/seed/devconnect-c/640/430',
  'https://picsum.photos/seed/devconnect-d/640/430',
  'https://picsum.photos/seed/devconnect-e/640/430',
];

/** A white chip so every brand logo reads cleanly on both light and dark grounds. */
const LogoChip: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
  <div
    aria-label={label}
    className="flex items-center justify-center h-[52px] px-5 rounded-2xl bg-white border border-[var(--ag-border)] shadow-[0_1px_3px_var(--ag-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_var(--ag-shadow)]"
  >
    {children}
  </div>
);

/** Google for Developers lockup: the 4-colour G mark + wordmark. */
const GoogleForDevelopersMark = () => (
  <span className="inline-flex items-center gap-2 leading-none">
    <img src="/logos/google-g.svg" alt="" className="h-5 w-5" />
    <span className="text-[15px] text-[#5f6368]">
      <span className="font-semibold text-[#3c4043]">Google</span> for Developers
    </span>
  </span>
);

/** Build with AI: Gemini-style gradient spark + wordmark. */
const BuildWithAIMark = () => (
  <span className="inline-flex items-center gap-2 leading-none">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bwaSpark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" /><stop offset="0.5" stopColor="#9b72f0" /><stop offset="1" stopColor="#EA4335" />
        </linearGradient>
      </defs>
      <path d="M12 2c.5 4.5 3 7 7.5 7.5C15 10 12.5 12.5 12 17c-.5-4.5-3-7-7.5-7.5C9 9 11.5 6.5 12 2z" fill="url(#bwaSpark)" />
      <path d="M19 14c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3z" fill="url(#bwaSpark)" />
    </svg>
    <span className="text-[15px] font-semibold text-[#3c4043]">Build with AI</span>
  </span>
);

export const LandingView: React.FC<LandingViewProps> = ({
  event, agenda, onExploreNetworking, onJoinLounge, totalAttendees, eventPhotos,
}) => {
  const photos = (eventPhotos && eventPhotos.length ? eventPhotos : DEFAULT_PHOTOS);
  const marquee = [...photos, ...photos]; // duplicate for a seamless loop

  return (
    <div className="relative z-10">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center pt-16 sm:pt-24 pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 mb-7">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-medium text-[var(--ag-muted)]">
            <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse" /> Build with AI · Hyderabad
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-medium text-[var(--ag-muted)]">
            Google for Developers · Hack2Skill
          </span>
        </motion.div>

        <h1 className="ag-display text-4xl sm:text-6xl lg:text-7xl font-bold text-[var(--ag-text)] leading-[1.05]">
          <KineticText text={event.title} stagger={0.018} delay={0.1} />
        </h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-[var(--ag-muted)] max-w-2xl mx-auto mt-6 leading-relaxed">
          {event.description}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
          <MagneticButton onClick={onExploreNetworking} className="ag-btn-dark group w-full sm:w-auto px-7 py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2">
            Explore attendees & network <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </MagneticButton>
          <MagneticButton onClick={onJoinLounge} strength={0.2} className="ag-btn-ghost w-full sm:w-auto px-6 py-3.5 text-sm font-semibold">
            Join the event lounge
          </MagneticButton>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-sm text-[var(--ag-muted)]">
          <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-[#4285F4]" /> {event.dates}</span>
          <span className="text-[#dadce0]">•</span>
          <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ea4335]" /> {event.venueName}, {event.venueCity}</span>
        </div>
      </section>

      {/* ── Partner logo strip ─────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-6">
        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-[var(--ag-faint)] mb-6">In partnership with</p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <LogoChip label="Google"><img src="/logos/google.svg" alt="Google" className="h-[22px] w-auto" /></LogoChip>
          <LogoChip label="Google for Developers"><GoogleForDevelopersMark /></LogoChip>
          <LogoChip label="Build with AI"><BuildWithAIMark /></LogoChip>
          <LogoChip label="Hack2Skill"><img src="/logos/hack2skill.png" alt="Hack2Skill" className="h-[26px] w-auto" /></LogoChip>
        </div>
      </section>

      {/* ── Event recap carousel (auto-scroll) ─────────────── */}
      <section className="py-12">
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-7">
          <h2 className="ag-display text-2xl sm:text-4xl font-bold text-[var(--ag-text)]">How the day unfolded</h2>
          <p className="text-[var(--ag-muted)] mt-2">Moments from Build with AI, Hyderabad.</p>
        </div>
        <div className="ag-marquee-group relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--ag-bg)] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--ag-bg)] to-transparent z-10" />
          <div className="ag-marquee flex gap-5 w-max px-5">
            {marquee.map((src, i) => (
              <div key={i} className="shrink-0 w-[clamp(240px,30vw,360px)] aspect-[3/2] rounded-3xl overflow-hidden border border-[var(--ag-border)] bg-[var(--ag-surface-2)]">
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { n: String(totalAttendees), l: 'Registered attendees', s: 'Developers & technology leaders' },
            { n: String(event.sessionsCount || 4), l: 'Core sessions', s: 'Agentic AI & hands-on workshops' },
            { n: '100%', l: 'Collaborative experience', s: `${event.venueName} · Kondapur` },
          ].map((c, i) => (
            <div key={i} className="ag-card ag-fade-up p-7 text-center" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-4xl sm:text-5xl font-bold text-[var(--ag-text)] tabular-nums tracking-tight">{c.n}</div>
              <div className="text-sm font-semibold text-[var(--ag-text)] mt-2">{c.l}</div>
              <div className="text-xs text-[var(--ag-muted)] mt-0.5">{c.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Agenda ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <h2 className="ag-display text-2xl sm:text-3xl font-bold text-[var(--ag-text)]">Schedule & timeline</h2>
            <p className="text-sm text-[var(--ag-muted)] mt-1">Today's hands-on workshop sessions at {event.venueName}.</p>
          </div>
          <span className="text-xs text-[var(--ag-faint)]">Indian Standard Time (IST)</span>
        </div>
        <div className="space-y-3.5">
          {agenda.map((item) => (
            <div key={item.id} className="ag-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--ag-card)] border border-[var(--ag-border)] text-xs font-semibold text-[var(--ag-text)] inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--ag-muted)]" /> {item.time}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--ag-text)]">{item.title}</h3>
                  <div className="text-xs text-[var(--ag-muted)] mt-0.5">{item.speaker} · {item.speakerRole}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs self-end md:self-center">
                <span className="px-2.5 py-1 rounded-full bg-[var(--ag-surface-2)] text-[var(--ag-muted)]">{item.track}</span>
                <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333]">{item.room}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guidelines ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10 pb-20">
        <div className="ag-card p-7 sm:p-9">
          <div className="flex items-center gap-2.5 mb-5">
            <ShieldCheck className="w-5 h-5 text-[#34a853]" />
            <h3 className="text-lg font-bold text-[var(--ag-text)]">Community guidelines</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-[var(--ag-muted)] leading-relaxed">
            {event.communityGuidelines.map((g, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[#4285F4] font-bold tabular-nums">0{i + 1}</span><span>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
