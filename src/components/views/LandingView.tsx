import React, { useState } from 'react';
import { EventDetails, AgendaItem } from '../../types';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Users, 
  ShieldCheck,
  Award,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  event: EventDetails;
  agenda: AgendaItem[];
  onExploreNetworking: () => void;
  onJoinLounge: () => void;
  totalAttendees: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  event,
  agenda,
  onExploreNetworking,
  onJoinLounge,
  totalAttendees,
}) => {
  return (
    <div className="relative z-10 space-y-16 py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative text-center space-y-8 pt-4 sm:pt-8">
        {/* Partner Badges: Google & Hack2Skill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-2.5"
        >
          {/* Google Partner Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-medium text-zinc-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Google Cloud Community</span>
          </div>

          {/* Hack2Skill Community Partner Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs font-medium text-zinc-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Hack2Skill Partner</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live in Hyderabad</span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {event.title}
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {event.description}
          </p>
        </motion.div>

        {/* Event Coordinates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-200"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel">
            <Calendar className="w-4 h-4 text-white" />
            <span>{event.dates}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{event.venueName}, {event.venueCity}</span>
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={onExploreNetworking}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg group"
          >
            <span>Explore Attendees & Network</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onJoinLounge}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel glass-panel-hover text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Join Event Lounge Chat</span>
          </button>
        </motion.div>

        {/* Event Metric Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6">
          <div className="glass-panel p-6 rounded-2xl text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
              {totalAttendees}
            </div>
            <div className="text-xs text-zinc-400 font-medium">Registered Attendees</div>
            <div className="text-[11px] text-zinc-500">Developers & Technology Leaders</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
              4
            </div>
            <div className="text-xs text-zinc-400 font-medium">Core Sessions</div>
            <div className="text-[11px] text-zinc-500">Agentic AI & Hands-on Workshop</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
              100%
            </div>
            <div className="text-xs text-zinc-400 font-medium">Collaborative Experience</div>
            <div className="text-[11px] text-zinc-500">{event.venueName} · Kondapur</div>
          </div>
        </div>
      </div>

      {/* Official Agenda Schedule */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Event Schedule & Timeline
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Detailed breakdown of today's hands-on workshop sessions at {event.venueName}.
            </p>
          </div>
          <div className="text-xs text-zinc-400">
            Timezone: Indian Standard Time (IST)
          </div>
        </div>

        <div className="space-y-3.5">
          {agenda.map((item, idx) => (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 px-3.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{item.time}</span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {item.speaker} · <span className="text-zinc-300">{item.speakerRole}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs self-end md:self-center">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/10">
                  {item.track}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {item.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Event Standards & Community Guidelines</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-zinc-300 leading-relaxed">
          {event.communityGuidelines.map((g, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-white font-bold">0{i + 1}.</span>
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
