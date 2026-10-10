import React, { useState } from 'react';
import { ChatMessage, EventDetails } from '../../types';
import { Send, Megaphone, Users, ShieldAlert, Sparkles } from 'lucide-react';

interface FrameEventRoomProps {
  event: EventDetails;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export const FrameEventRoom: React.FC<FrameEventRoomProps> = ({
  event,
  messages,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTopic, setActiveTopic] = useState('All');

  const topics = ['All', 'Hackathon Teams', 'Room Coordinates', 'API Q&A', 'Lunch & Coffee'];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-slate-900 min-h-full flex flex-col">
      {/* Top Lounge Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-base font-bold text-white">
                Common Event Lounge · Hyderabad Room
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live discussion stream for verified attendees of {event.title} at {event.venueName}.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>248 Builders in Room</span>
          </div>
        </div>

        {/* Pinned Organizer Notice */}
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-200">
          <Megaphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-300">Pinned Announcement: </span>
            Hackathon team formations are underway in Co-Working Arena Table 1-8. Demo submissions close at 4:30 PM!
          </div>
        </div>

        {/* Topic Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(t)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                activeTopic === t
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors flex items-start gap-3 group"
          >
            <img
              src={msg.senderAvatar}
              alt={msg.senderName}
              className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{msg.senderName}</span>
                  {msg.isSelf && (
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-800/60">
                      You
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {msg.timestamp}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Composer with Rate Limiting Notice */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share an update or question with all Hyderabad attendees..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Broadcast</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
          <span>Scaped exclusively to {event.title}</span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-slate-400" />
            <span>Anti-spam rate limit: 1 msg / 3s</span>
          </span>
        </div>
      </form>
    </div>
  );
};
