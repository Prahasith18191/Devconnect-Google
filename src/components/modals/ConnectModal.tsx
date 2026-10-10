import React, { useState } from 'react';
import { AttendeeProfile } from '../../types';
import { X, Send, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ConnectModalProps {
  attendee: AttendeeProfile;
  onClose: () => void;
  onSend: (attendeeId: string, note: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  attendee,
  onClose,
  onSend,
}) => {
  const [note, setNote] = useState(
    `Hey ${attendee.fullName.split(' ')[0]}! Saw you're working with ${attendee.skills[0] || 'AI'}. Would love to connect at the Hyderabad bootcamp!`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(attendee.id, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel border-white/20 rounded-3xl max-w-md w-full p-6 space-y-5 bg-[#060a14]/90 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 pr-8">
          <img
            src={attendee.avatarUrl}
            alt={attendee.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-white/20"
          />
          <div>
            <h3 className="text-base font-bold text-white">Connect with {attendee.fullName}</h3>
            <p className="text-xs text-zinc-400 truncate">{attendee.company}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Personalized Note (Explain why you want to connect):
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={280}
              className="w-full p-3 glass-input rounded-xl text-xs placeholder-zinc-500 font-sans resize-none"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>Recipient receives in-app and SMTP email alert</span>
              <span>{note.length}/280</span>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
