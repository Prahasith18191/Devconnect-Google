import React, { useState, useEffect } from 'react';
import { AttendeeProfile, ChatMessage } from '../../types';
import { Send, CheckCircle2, Search, Lock, UserPlus, Sparkles, MessageSquare } from 'lucide-react';

interface MessagesViewProps {
  attendees: AttendeeProfile[];
  messages: ChatMessage[];
  currentUserId?: string;
  initialSelectedPeerId?: string | null;
  onSendMessage: (receiverId: string, content: string) => void;
  onExploreNetworking: () => void;
  onAcceptConnection?: (attendeeId: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  attendees,
  messages,
  currentUserId = 'usr-1',
  initialSelectedPeerId,
  onSendMessage,
  onExploreNetworking,
  onAcceptConnection,
}) => {
  // Available peers are all attendees except self
  const otherPeers = attendees.filter((a) => a.id !== currentUserId);
  const connectedPeers = otherPeers.filter((a) => a.connectionStatus === 'connected');

  const [activeTab, setActiveTab] = useState<'all' | 'connected'>('all');
  const [selectedPeerId, setSelectedPeerId] = useState<string>(
    initialSelectedPeerId || connectedPeers[0]?.id || otherPeers[0]?.id || 'usr-2'
  );
  const [inputText, setInputText] = useState('');
  const [searchPeer, setSearchPeer] = useState('');

  // Sync if initialSelectedPeerId changes from props
  useEffect(() => {
    if (initialSelectedPeerId) {
      setSelectedPeerId(initialSelectedPeerId);
    }
  }, [initialSelectedPeerId]);

  const activePeer = attendees.find((a) => a.id === selectedPeerId) || otherPeers[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePeer) return;
    onSendMessage(activePeer.id, inputText.trim());
    setInputText('');
  };

  const handleSimulateReply = () => {
    if (!activePeer) return;
    const replies = [
      `Hey! Thanks for messaging. Enjoying the Antigravity session here at Cohort Coworkspaces!`,
      `Great to connect! Are you working on Cloud Agentic workflows with Gemini API?`,
      `Let's meet at the coffee break around 12:30 PM near the auditorium.`,
      `Awesome. I'm testing our FastAPI endpoints with pgvector. Would love to share insights!`,
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    // Simulate incoming message from active peer
    const fakeMsg: ChatMessage = {
      id: `msg-sim-${Date.now()}`,
      conversationId: `conv-${activePeer.id}`,
      senderId: activePeer.id,
      senderName: activePeer.fullName,
      senderAvatar: activePeer.avatarUrl,
      content: randomReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: false,
    };
    onSendMessage(currentUserId, randomReply); // Or dispatch directly
  };

  const displayList = activeTab === 'connected' ? connectedPeers : otherPeers;
  const filteredPeers = displayList.filter((p) =>
    p.fullName.toLowerCase().includes(searchPeer.toLowerCase()) ||
    p.company.toLowerCase().includes(searchPeer.toLowerCase())
  );

  // Filter messages for active peer
  const activeConversationMessages = messages.filter((m) => {
    if (!activePeer) return false;
    const matchPeerConv = 
      m.conversationId === `conv-${activePeer.id}` ||
      m.conversationId === `conv-${currentUserId}` ||
      m.conversationId === `conv-${activePeer.id}-${currentUserId}` ||
      m.conversationId === `conv-${currentUserId}-${activePeer.id}`;
    
    const matchSenderReceiver = 
      (m.senderId === activePeer.id) ||
      (m.senderId === currentUserId && m.conversationId.includes(activePeer.id));

    return matchPeerConv || matchSenderReceiver;
  });

  return (
    <div className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="glass-panel rounded-3xl overflow-hidden h-full flex flex-col md:flex-row border border-[var(--ag-border)]">
        {/* Left Sidebar: Conversations */}
        <div className="w-full md:w-80 border-r border-[var(--ag-border)] bg-[var(--ag-surface)] flex flex-col shrink-0">
          <div className="p-4 border-b border-[var(--ag-border)] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--ag-text)]">Direct Messaging</h2>
              <span className="text-[11px] font-mono text-[var(--ag-muted)] bg-[var(--ag-surface)] px-2 py-0.5 rounded-md border border-[var(--ag-border)]">
                {otherPeers.length} Attendees
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[var(--ag-surface)] rounded-xl border border-[var(--ag-border)]">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                    : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
                }`}
              >
                All ({otherPeers.length})
              </button>
              <button
                onClick={() => setActiveTab('connected')}
                className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'connected'
                    ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                    : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
                }`}
              >
                Connected ({connectedPeers.length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--ag-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchPeer}
                onChange={(e) => setSearchPeer(e.target.value)}
                placeholder="Search attendees..."
                className="w-full pl-8 pr-3 py-1.5 glass-input rounded-xl text-xs placeholder-zinc-500 font-sans"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[var(--ag-border)]">
            {filteredPeers.length === 0 ? (
              <div className="p-6 text-center space-y-3">
                <p className="text-xs text-[var(--ag-muted)]">
                  {activeTab === 'connected'
                    ? 'No accepted connections yet. You can chat with any attendee by switching to "All".'
                    : 'No attendees matching search.'}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSearchPeer('');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--ag-invert-bg)] text-[var(--ag-invert-fg)] text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  View All Attendees
                </button>
              </div>
            ) : (
              filteredPeers.map((peer) => {
                const isSelected = peer.id === activePeer?.id;
                const isPeerConnected = peer.connectionStatus === 'connected';

                return (
                  <button
                    key={peer.id}
                    onClick={() => setSelectedPeerId(peer.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isSelected ? 'bg-[var(--ag-surface)]' : 'hover:bg-[var(--ag-surface)]'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={peer.avatarUrl}
                        alt={peer.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-[var(--ag-border)] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      {isPeerConnected && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[var(--g-green)] rounded-full border-2 border-[var(--ag-card)]"></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--ag-text)] truncate">{peer.fullName}</span>
                        {isPeerConnected ? (
                          <span className="text-[10px] text-[var(--g-green)] font-mono">Connected</span>
                        ) : (
                          <span className="text-[10px] text-[var(--ag-faint)] font-mono">Attendee</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--ag-muted)] truncate mt-0.5">{peer.company}</p>
                      <p className="text-[11px] text-[var(--ag-muted)] truncate mt-1">
                        {isSelected ? 'Active chat window' : 'Tap to start conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Canvas: Chat Window */}
        <div className="flex-1 flex flex-col bg-[var(--ag-bg)]">
          {activePeer ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[var(--ag-border)] bg-[var(--ag-surface)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activePeer.avatarUrl}
                    alt={activePeer.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-[var(--ag-border)] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--ag-text)]">{activePeer.fullName}</h3>
                      {activePeer.connectionStatus === 'connected' ? (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--g-green)] font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--ag-muted)] font-mono bg-[var(--ag-surface)] px-2 py-0.5 rounded-full border border-[var(--ag-border)]">
                          <span>Direct Channel</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--ag-muted)] truncate max-w-md">{activePeer.headline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activePeer.connectionStatus !== 'connected' && onAcceptConnection && (
                    <button
                      onClick={() => onAcceptConnection(activePeer.id)}
                      className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--ag-invert-bg)] text-[var(--ag-invert-fg)] hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect Peer</span>
                    </button>
                  )}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[var(--ag-muted)] bg-[var(--ag-surface)] px-3 py-1.5 rounded-xl border border-[var(--ag-border)]">
                    <Lock className="w-3 h-3 text-[var(--ag-muted)]" />
                    <span>Supabase Live</span>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
                <div className="text-center my-2">
                  <span className="text-[10px] font-mono text-[var(--ag-muted)] bg-[var(--ag-surface)] px-3 py-1 rounded-full border border-[var(--ag-border)]">
                    Session: Hyderabad Build with AI & Antigravity Bootcamp
                  </span>
                </div>

                {activeConversationMessages.length === 0 ? (
                  <div className="p-8 text-center space-y-3 glass-panel rounded-2xl max-w-md mx-auto my-6">
                    <MessageSquare className="w-8 h-8 text-[var(--ag-muted)] mx-auto" />
                    <h4 className="text-sm font-semibold text-[var(--ag-text)]">Start the conversation with {activePeer.fullName.split(' ')[0]}</h4>
                    <p className="text-xs text-[var(--ag-muted)]">
                      Send a message about their technical interests ({activePeer.skills?.slice(0, 2).join(', ')}) or discuss today's sessions!
                    </p>
                  </div>
                ) : (
                  activeConversationMessages.map((msg) => {
                    const isSelf = msg.senderId === currentUserId || msg.isSelf;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 max-w-xl ${
                          isSelf ? 'ml-auto flex-row-reverse' : ''
                        }`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-lg object-cover border border-[var(--ag-border)] shrink-0 mt-1"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`space-y-1 ${isSelf ? 'items-end text-right' : ''}`}>
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isSelf
                                ? 'bg-[var(--ag-invert-bg)] text-[var(--ag-invert-fg)] font-medium rounded-tr-none shadow-sm'
                                : 'glass-panel text-[var(--ag-text)] rounded-tl-none border-[var(--ag-border)]'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className="text-[10px] text-[var(--ag-muted)] font-mono px-1 tabular-nums">
                            {msg.senderName} · {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSend} className="p-4 border-t border-[var(--ag-border)] bg-[var(--ag-surface)]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Direct message to ${activePeer.fullName.split(' ')[0]}...`}
                    className="flex-1 px-4 py-2.5 glass-input rounded-xl text-xs sm:text-sm placeholder-zinc-500 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-5 py-2.5 bg-[var(--ag-invert-bg)] text-[var(--ag-invert-fg)] hover:opacity-90 disabled:opacity-40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[var(--ag-muted)] space-y-3">
              <h3 className="text-base font-semibold text-[var(--ag-text)]">No attendee selected</h3>
              <p className="text-xs text-[var(--ag-muted)] max-w-xs">
                Select an attendee on the left to start direct messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
