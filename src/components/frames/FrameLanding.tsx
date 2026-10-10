import React, { useState } from 'react';
import { EventDetails, AgendaItem } from '../../types';
import { Calendar, MapPin, Users, Award, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface FrameLandingProps {
  event: EventDetails;
  agenda: AgendaItem[];
  onNavigateToDirectory: () => void;
}

export const FrameLanding: React.FC<FrameLandingProps> = ({
  event,
  agenda,
  onNavigateToDirectory,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const tracks = ['All', 'AI Architecture', 'Data & Systems', 'Hackathon Sprint', 'Demo Stage'];

  const filteredAgenda = selectedTrack === 'All'
    ? agenda
    : agenda.filter((item) => item.track === selectedTrack);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-full pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 px-6 py-12 sm:py-20 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Live Bootcamp · Hyderabad</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
            {event.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{event.dates}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{event.venueName}, {event.venueCity}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToDirectory}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Discover & Connect with Builders</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-xs text-slate-400">
              Organized by <strong className="text-slate-200">{event.organizer}</strong>
            </div>
          </div>
        </div>

        {/* 3 Real Metric Counters */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-3 gap-4 border-t border-slate-800 pt-8">
          <div className="text-center p-3 rounded-lg bg-slate-800/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {event.attendeeCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">Builders Registered</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {event.sessionsCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">Deep-Dive Sessions</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {event.tracksCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">Specialized Tracks</div>
          </div>
        </div>
      </div>

      {/* Schedule & Agenda Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Event Schedule & Sessions</h2>
            <p className="text-xs sm:text-sm text-slate-400">Hands-on architecture sessions, hackathon arena, and project demos.</p>
          </div>

          {/* Track Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/70 rounded-lg border border-slate-700/60 overflow-x-auto">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedTrack === track
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Cards */}
        <div className="space-y-4">
          {filteredAgenda.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-mono text-blue-400 bg-blue-950/60 px-2.5 py-1.5 rounded-md border border-blue-800/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Speaker: <span className="text-white font-medium">{item.speaker}</span> · <span className="text-slate-400">{item.speakerRole}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center text-xs">
                <span className="text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                  {item.track}
                </span>
                <span className="text-emerald-400 font-mono bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/50">
                  {item.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="max-w-5xl mx-auto px-6 pt-4">
        <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DevConnect Community & Networking Standards</span>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-400">
            {event.communityGuidelines.map((guideline, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 font-mono">0{idx + 1}.</span>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
