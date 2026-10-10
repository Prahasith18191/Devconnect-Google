import React from 'react';
import { ConnectionRequest } from '../../types';
import { X, Check, Trash2, Bell, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incomingRequests: ConnectionRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  incomingRequests,
  onAcceptRequest,
  onRejectRequest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="w-full max-w-md bg-[#030712] border-l border-white/[0.08] h-full flex flex-col shadow-2xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-white" />
            <h2 className="text-base font-bold text-white">Notifications & Requests</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Connection Requests ({incomingRequests.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Peers who want to network with you at the Hyderabad bootcamp.
            </p>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400 glass-panel rounded-2xl">
              No pending connection requests.
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="glass-panel p-4 rounded-2xl space-y-3 border-white/10"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={req.senderAvatar}
                    alt={req.senderName}
                    className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white">{req.senderName}</h4>
                    <p className="text-[11px] text-zinc-400 truncate">{req.senderHeadline}</p>
                    <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                      {req.timestamp}
                    </span>
                  </div>
                </div>

                {req.note && (
                  <p className="text-xs text-zinc-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06] italic">
                    "{req.note}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => onRejectRequest(req.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => onAcceptRequest(req.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Broadcast Alert */}
          <div className="glass-panel p-4 rounded-2xl space-y-2 border-white/10 mt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Bootcamp Broadcast</span>
            </div>
            <p className="text-xs text-zinc-300">
              Welcome to Build with AI Hyderabad at Cohort Coworkspaces, Kondapur! Explore attendee stacks and share your hackathon builds in the feed.
            </p>
            <span className="text-[10px] text-zinc-400 font-mono block">Organizers · Today</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
