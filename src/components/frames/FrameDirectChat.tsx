import React, { useState } from 'react';
import { AttendeeProfile, ChatMessage } from '../../types';
import { Send, CheckCircle2, Search, ArrowLeft } from 'lucide-react';

interface FrameDirectChatProps {
  attendees: AttendeeProfile[];
  messages: ChatMessage[];
  onSendMessage: (receiverId: string, content: string) => void;
  initialSelectedId?: string;
  onBackToDirectory?: () => void;
}

export const FrameDirectChat: React.FC<FrameDirectChatProps> = ({
  attendees,
  messages,
  onSendMessage,
  initialSelectedId,
  onBackToDirectory,
}) => {
  // Only accepted connections can be directly messaged
  const connectedPeers = attendees.filter(
    (a) => a.connectionStatus === 'connected' && a.id !== 'usr-1'
  );

  const [selectedPeerId, setSelectedPeerId] = useState<string>(
    initialSelectedId || (connectedPeers[0]?.id ?? 'usr-2')
  );
  const [inputText, setInputText] = useState('');
  const [searchPeer, setSearchPeer] = useState('');

  const activePeer = attendees.find((a) => a.id === selectedPeerId) || connectedPeers[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePeer) return;
    onSendMessage(activePeer.id, inputText.trim());
    setInputText('');
  };

  const filteredPeers = connectedPeers.filter((p) =>
    p.fullName.toLowerCase().includes(searchPeer.toLowerCase())
  );

  return (
    <div className="bg-slate-900 min-h-full flex flex-col md:flex-row border-slate-800">
      {/* Left Sidebar: Conversations List (320px) */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--ag-text)]">Direct Messages</h3>
            <span className="text-[11px] font-mono text-[var(--g-green)] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {connectedPeers.length} Connected
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--ag-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPeer}
              onChange={(e) => setSearchPeer(e.target.value)}
              placeholder="Filter connections..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-[var(--ag-text)] placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Peer List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredPeers.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--ag-faint)]">
              No accepted connections yet. Connect with attendees in the directory to unlock 1-on-1 messaging.
            </div>
          ) : (
            filteredPeers.map((peer) => {
              const isSelected = peer.id === activePeer?.id;
              return (
                <button
                  key={peer.id}
                  onClick={() => setSelectedPeerId(peer.id)}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                    isSelected ? 'bg-slate-800/90' : 'hover:bg-slate-900'
                  }`}
                >
                  <img
                    src={peer.avatarUrl}
                    alt={peer.fullName}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--ag-text)] truncate">{peer.fullName}</span>
                      <span className="text-[10px] text-[var(--ag-faint)] font-mono">10:09 AM</span>
                    </div>
                    <p className="text-[11px] text-[var(--ag-muted)] truncate mt-0.5">{peer.company}</p>
                    <p className="text-[11px] text-[var(--ag-muted)] truncate mt-1">
                      {isSelected ? 'Active conversation' : 'Let\'s grab coffee during lunch...'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Canvas: Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-900 min-h-[500px]">
        {activePeer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {onBackToDirectory && (
                  <button
                    onClick={onBackToDirectory}
                    className="md:hidden p-1.5 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg bg-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <img
                  src={activePeer.avatarUrl}
                  alt={activePeer.fullName}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-[var(--ag-text)]">{activePeer.fullName}</h4>
                    <span className="flex items-center gap-1 text-[11px] text-[var(--g-green)] font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)] truncate max-w-md">{activePeer.headline}</p>
                </div>
              </div>

              <div className="hidden sm:block text-xs font-mono text-[var(--ag-muted)] bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                End-to-End Authorized
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div className="text-center my-2">
                <span className="text-[11px] font-mono text-[var(--ag-faint)] bg-slate-800/40 px-3 py-1 rounded-full border border-slate-800">
                  Bootcamp Session: Today, October 10
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-xl ${
                    msg.isSelf ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-md object-cover border border-slate-700 shrink-0 mt-1"
                  />
                  <div className={`space-y-1 ${msg.isSelf ? 'items-end text-right' : ''}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.isSelf
                          ? 'bg-blue-600 text-[var(--ag-text)] rounded-tr-none'
                          : 'bg-slate-800 text-[var(--ag-text)] rounded-tl-none border border-slate-700/80'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-[var(--ag-faint)] font-mono px-1 tabular-nums">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Send private message to ${activePeer.fullName.split(' ')[0]}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-[var(--ag-text)] placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-[var(--ag-text)] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[var(--ag-muted)]">
            <h4 className="text-base font-semibold text-[var(--ag-text)]">No active conversation</h4>
            <p className="text-xs text-[var(--ag-muted)] mt-1 max-w-xs">
              Select an accepted connection from the sidebar or request to connect in the directory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
