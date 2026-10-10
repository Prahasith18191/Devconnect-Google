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
        className="w-full max-w-md bg-[var(--ag-bg)] border-l border-[var(--ag-border)] h-full flex flex-col shadow-2xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--ag-border)]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[var(--ag-text)]" />
            <h2 className="text-base font-bold text-[var(--ag-text)]">Notifications & Requests</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-[var(--ag-surface)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--ag-muted)] font-semibold">
              Connection Requests ({incomingRequests.length})
            </h3>
            <p className="text-xs text-[var(--ag-muted)]">
              Peers who want to network with you at the Hyderabad bootcamp.
            </p>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--ag-muted)] glass-panel rounded-2xl">
              No pending connection requests.
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="glass-panel p-4 rounded-2xl space-y-3 border-[var(--ag-border)]"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={req.senderAvatar}
                    alt={req.senderName}
                    className="w-10 h-10 rounded-xl object-cover border border-[var(--ag-border)] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[var(--ag-text)]">{req.senderName}</h4>
                    <p className="text-[11px] text-[var(--ag-muted)] truncate">{req.senderHeadline}</p>
                    <span className="text-[10px] text-[var(--ag-muted)] font-mono mt-0.5 block">
                      {req.timestamp}
                    </span>
                  </div>
                </div>

                {req.note && (
                  <p className="text-xs text-[var(--ag-muted)] bg-[var(--ag-surface)] p-2.5 rounded-xl border border-[var(--ag-border)] italic">
                    "{req.note}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => onRejectRequest(req.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-[var(--ag-surface)] transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => onAcceptRequest(req.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--ag-card)] text-[var(--ag-text)] hover:opacity-90 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Broadcast Alert */}
          <div className="glass-panel p-4 rounded-2xl space-y-2 border-[var(--ag-border)] mt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--ag-text)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--ag-text)]" />
              <span>Bootcamp Broadcast</span>
            </div>
            <p className="text-xs text-[var(--ag-muted)]">
              Welcome to Build with AI Hyderabad at Cohort Coworkspaces, Kondapur! Explore attendee stacks and share your hackathon builds in the feed.
            </p>
            <span className="text-[10px] text-[var(--ag-muted)] font-mono block">Organizers · Today</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
