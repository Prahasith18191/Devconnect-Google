import React from 'react';
import { AttendeeProfile } from '../../types';
import { 
  X, 
  Github, 
  Linkedin, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  ExternalLink 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileModalProps {
  profile: AttendeeProfile;
  onClose: () => void;
  onOpenConnectModal: (attendee: AttendeeProfile) => void;
  onNavigateToChat: (attendeeId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onOpenConnectModal,
  onNavigateToChat,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="glass-panel border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative bg-[#060a14]/90"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ambient Accent */}
        <div className="h-28 bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-transparent border-b border-white/10 relative">
          <div className="absolute -bottom-10 left-6">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-[#030712] shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 sm:px-8 pb-8 space-y-6">
          {/* Identity & Social Outbound */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white glow-text">{profile.fullName}</h2>
                {profile.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-xs font-medium text-zinc-300 mt-0.5">{profile.headline}</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {profile.company} · {profile.experienceYears} Years ({profile.experienceLevel})
              </p>
            </div>

            <div className="flex items-center gap-2">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              Engineering Biography
            </h3>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06]">
              {profile.bio}
            </p>
          </div>

          {/* Skills and Learning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                <span>Primary Technical Stack</span>
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                {profile.skills.map((skill, idx, arr) => (
                  <span key={skill}>
                    <strong className="text-white font-medium">{skill}</strong>
                    {idx < arr.length - 1 && <span className="mx-1.5 text-zinc-600">·</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Currently Researching</span>
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                {profile.learning.map((item, idx, arr) => (
                  <span key={item}>
                    <span className="text-zinc-200">{item}</span>
                    {idx < arr.length - 1 && <span className="mx-1.5 text-zinc-600">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Bootcamp Builds & Repositories
              </h3>
              <div className="space-y-2">
                {profile.projects.map((p, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{p.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{p.desc}</p>
                    </div>
                    <span className="text-xs text-white font-mono flex items-center gap-1 shrink-0">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">
              Status: <span className="text-white font-semibold">{profile.connectionStatus.replace('_', ' ')}</span>
            </span>

            {profile.connectionStatus === 'connected' ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToChat(profile.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Direct Chat</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenConnectModal(profile);
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Send Connection Request</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
