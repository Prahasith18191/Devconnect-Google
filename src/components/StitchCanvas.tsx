import React, { useState } from 'react';
import { StitchFrameSpec, EventDetails, AgendaItem, AttendeeProfile, ChatMessage, CommunityPost } from '../types';
import { FrameLanding } from './frames/FrameLanding';
import { FrameDirectory } from './frames/FrameDirectory';
import { FrameProfile } from './frames/FrameProfile';
import { FrameDirectChat } from './frames/FrameDirectChat';
import { FrameEventRoom } from './frames/FrameEventRoom';
import { FrameCommunityFeed } from './frames/FrameCommunityFeed';
import { FrameAdminDashboard } from './frames/FrameAdminDashboard';
import { 
  Monitor, 
  Smartphone, 
  Code, 
  Copy, 
  Check, 
  Maximize2, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface StitchCanvasProps {
  frames: StitchFrameSpec[];
  event: EventDetails;
  agenda: AgendaItem[];
  attendees: AttendeeProfile[];
  messages: ChatMessage[];
  roomMessages: ChatMessage[];
  posts: CommunityPost[];
  onUpdateEvent: (ev: EventDetails) => void;
  onSendConnectionRequest: (attendeeId: string, note: string) => void;
  onSendMessage: (receiverId: string, content: string) => void;
  onSendRoomMessage: (content: string) => void;
  onCreatePost: (content: string, codeSnippet?: string) => void;
  onReactPost: (postId: string, reaction: 'like' | 'dislike') => void;
  onAddComment: (postId: string, content: string) => void;
}

export const StitchCanvas: React.FC<StitchCanvasProps> = ({
  frames,
  event,
  agenda,
  attendees,
  messages,
  roomMessages,
  posts,
  onUpdateEvent,
  onSendConnectionRequest,
  onSendMessage,
  onSendRoomMessage,
  onCreatePost,
  onReactPost,
  onAddComment,
}) => {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showInspector, setShowInspector] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AttendeeProfile | null>(null);

  const currentFrame = frames[activeFrameIndex];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentFrame.stitchPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Frame Selection & Viewport Controls Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Frame Navigator Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {frames.map((frame, idx) => (
            <button
              key={frame.id}
              onClick={() => setActiveFrameIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeFrameIndex === idx
                  ? 'bg-blue-600 text-[var(--ag-text)] shadow-xs'
                  : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-slate-800'
              }`}
            >
              <span className="font-mono text-[10px] text-blue-200">{frame.frameCode}</span>
              <span>{frame.name.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Viewport & Inspector Toggles */}
        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-slate-800 text-[var(--ag-text)]'
                  : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
              }`}
              title="1440px Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1440px</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-slate-800 text-[var(--ag-text)]'
                  : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
              }`}
              title="390px Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">390px</span>
            </button>
          </div>

          {/* Inspector Panel Toggle */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showInspector
                ? 'bg-indigo-950/70 border-indigo-700 text-indigo-300'
                : 'bg-slate-900 border-slate-700 text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Stitch Prompt & Spec</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Canvas Stage + Optional Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Stage */}
        <div className="flex-1 bg-slate-950/80 p-4 sm:p-6 overflow-y-auto flex items-start justify-center">
          <div
            className={`transition-all duration-200 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ${
              deviceMode === 'desktop'
                ? 'w-full max-w-[1440px] min-h-[780px]'
                : 'w-[390px] min-h-[760px] max-w-full'
            }`}
          >
            {/* Viewport Frame Badge */}
            <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-[var(--ag-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="font-semibold text-[var(--ag-text)]">{currentFrame.frameCode}</span>
                <span>· {currentFrame.name}</span>
              </div>
              <div>
                {deviceMode === 'desktop' ? currentFrame.desktopDimensions : currentFrame.mobileDimensions}
              </div>
            </div>

            {/* Render Selected Frame View */}
            <div className="relative">
              {activeFrameIndex === 0 && (
                <FrameLanding
                  event={event}
                  agenda={agenda}
                  onNavigateToDirectory={() => setActiveFrameIndex(1)}
                />
              )}

              {activeFrameIndex === 1 && (
                <FrameDirectory
                  attendees={attendees}
                  onSelectProfile={(profile) => setSelectedProfile(profile)}
                  onSendConnectionRequest={onSendConnectionRequest}
                  onNavigateToChat={() => setActiveFrameIndex(3)}
                />
              )}

              {activeFrameIndex === 2 && (
                <div className="p-8">
                  <div className="text-center py-6 text-[var(--ag-muted)] text-xs">
                    Profile Showcase Frame Modal (Click below to preview or inspect in Directory)
                  </div>
                  <FrameProfile
                    profile={attendees[0]}
                    onClose={() => setActiveFrameIndex(1)}
                    onSendConnectionRequest={onSendConnectionRequest}
                    onNavigateToChat={() => setActiveFrameIndex(3)}
                  />
                </div>
              )}

              {activeFrameIndex === 3 && (
                <FrameDirectChat
                  attendees={attendees}
                  messages={messages}
                  onSendMessage={onSendMessage}
                  onBackToDirectory={() => setActiveFrameIndex(1)}
                />
              )}

              {activeFrameIndex === 4 && (
                <FrameEventRoom
                  event={event}
                  messages={roomMessages}
                  onSendMessage={onSendRoomMessage}
                />
              )}

              {activeFrameIndex === 5 && (
                <FrameCommunityFeed
                  posts={posts}
                  onCreatePost={onCreatePost}
                  onReactPost={onReactPost}
                  onAddComment={onAddComment}
                />
              )}

              {activeFrameIndex === 6 && (
                <FrameAdminDashboard
                  event={event}
                  attendees={attendees}
                  onUpdateEvent={onUpdateEvent}
                  onToggleSuspendUser={(userId) => {
                    console.log('Suspend toggle:', userId);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Inspector Drawer (Prompt & Spec Engine) */}
        {showInspector && (
          <div className="w-96 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[var(--ag-text)] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Stitch Frame Spec</span>
                </h4>
                <p className="text-[11px] text-[var(--ag-muted)] font-mono mt-0.5">{currentFrame.frameCode}</p>
              </div>

              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-[var(--ag-text)] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Purpose */}
              <div className="space-y-1">
                <span className="text-[var(--ag-muted)] font-mono text-[10px] uppercase">Purpose</span>
                <p className="text-[var(--ag-text)] bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {currentFrame.purpose}
                </p>
              </div>

              {/* Design Tokens */}
              <div className="space-y-2">
                <span className="text-[var(--ag-muted)] font-mono text-[10px] uppercase">Design Tokens</span>
                <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                  <div className="text-[var(--ag-muted)]">
                    <span className="text-[var(--ag-faint)]">Bg: </span>
                    {currentFrame.designTokens.background}
                  </div>
                  <div className="text-[var(--ag-muted)]">
                    <span className="text-[var(--ag-faint)]">Surfaces: </span>
                    {currentFrame.designTokens.surfaces}
                  </div>
                  <div className="text-[var(--ag-muted)]">
                    <span className="text-[var(--ag-faint)]">Accents: </span>
                    {currentFrame.designTokens.accents}
                  </div>
                  <div className="text-[var(--ag-muted)]">
                    <span className="text-[var(--ag-faint)]">Type: </span>
                    {currentFrame.designTokens.typography}
                  </div>
                </div>
              </div>

              {/* Component Hierarchy */}
              <div className="space-y-1.5">
                <span className="text-[var(--ag-muted)] font-mono text-[10px] uppercase">Components Included</span>
                <div className="flex flex-wrap gap-1">
                  {currentFrame.targetComponents.map((c) => (
                    <span key={c} className="text-[11px] font-mono text-[var(--ag-muted)] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      &lt;{c} /&gt;
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Interactions */}
              <div className="space-y-1.5">
                <span className="text-[var(--ag-muted)] font-mono text-[10px] uppercase">Key Interactions</span>
                <ul className="space-y-1 text-[var(--ag-muted)] text-[11px] list-disc list-inside">
                  {currentFrame.keyInteractions.map((ki, i) => (
                    <li key={i}>{ki}</li>
                  ))}
                </ul>
              </div>

              {/* Ready-to-Paste Stitch Prompt */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--ag-muted)] font-mono text-[10px] uppercase">Google Stitch / AI Studio Prompt</span>
                  <button
                    onClick={handleCopyPrompt}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-blue-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {currentFrame.stitchPrompt}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Detail Modal if clicked */}
      {selectedProfile && (
        <FrameProfile
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSendConnectionRequest={onSendConnectionRequest}
          onNavigateToChat={() => {
            setSelectedProfile(null);
            setActiveFrameIndex(3);
          }}
        />
      )}
    </div>
  );
};
