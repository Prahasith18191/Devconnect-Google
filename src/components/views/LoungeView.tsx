import React, { useState } from 'react';
import { ChatMessage, EventDetails } from '../../types';
import { Send, Users, Megaphone, ShieldAlert, Radio } from 'lucide-react';
import { motion } from 'motion/react';

interface LoungeViewProps {
  event: EventDetails;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export const LoungeView: React.FC<LoungeViewProps> = ({
  event,
  messages,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState('All');

  const topics = ['All', 'Hackathon Teams', 'Room Coordinates', 'API Q&A', 'Lunch & Coffee'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="relative z-10 space-y-6 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-3xl space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--ag-text)] glow-text">
                Common Event Lounge · Hyderabad Room
              </h1>
            </div>
            <p className="text-xs text-[var(--ag-muted)] mt-0.5">
              Live broadcast space for all verified attendees of {event.title}.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--ag-muted)] px-3 py-1.5 rounded-xl bg-[var(--ag-surface)] border border-[var(--ag-border)] shrink-0">
            <Users className="w-3.5 h-3.5 text-[var(--g-green)]" />
            <span>248 Builders Active</span>
          </div>
        </div>

        {/* Pinned Organizer Notice */}
        <div className="p-3 rounded-xl bg-[var(--ag-surface)] border border-[var(--ag-border)] flex items-start gap-2.5 text-xs text-[var(--ag-text)]">
          <Megaphone className="w-4 h-4 text-[var(--ag-text)] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-[var(--ag-text)]">Organizer Broadcast: </span>
            Hackathon team formation is in progress at Tables 1-8. Demo submissions open at 4:00 PM!
          </div>
        </div>

        {/* Topic Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
                topic === t
                  ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                  : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)] bg-[var(--ag-surface)] border border-[var(--ag-border)]'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 glass-panel p-4 sm:p-6 rounded-3xl overflow-y-auto space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3.5 rounded-2xl bg-[var(--ag-surface)] border border-[var(--ag-border)] hover:border-[var(--ag-border)] transition-colors flex items-start gap-3.5"
          >
            <img
              src={msg.senderAvatar}
              alt={msg.senderName}
              className="w-9 h-9 rounded-xl object-cover border border-[var(--ag-border)] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--ag-text)]">{msg.senderName}</span>
                  {msg.isSelf && (
                    <span className="text-[10px] font-mono text-[var(--ag-muted)] bg-[var(--ag-surface)] px-1.5 py-0.5 rounded border border-[var(--ag-border)]">
                      You
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-[var(--ag-muted)] tabular-nums">
                  {msg.timestamp}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ag-text)] mt-1 leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Composer Input Bar */}
      <form onSubmit={handleSubmit} className="glass-panel p-4 rounded-3xl space-y-2 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Broadcast a note or table coordinate to all attendees..."
            className="flex-1 px-4 py-2.5 glass-input rounded-xl text-xs sm:text-sm placeholder-zinc-500 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2.5 bg-[var(--ag-card)] text-[var(--ag-text)] hover:opacity-90 disabled:opacity-40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--ag-muted)] font-mono px-1">
          <span>Room: {event.slug || 'hyd-gemini-2026'}</span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[var(--ag-muted)]" />
            <span>Anti-spam: 1 message / 3 seconds</span>
          </span>
        </div>
      </form>
    </div>
  );
};
