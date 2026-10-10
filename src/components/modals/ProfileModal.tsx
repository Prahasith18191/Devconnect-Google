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
    <div className="fixed inset-0 z-50 bg-[var(--ag-bg)]/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="glass-panel border-[var(--ag-border)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative bg-[#060a14]/90"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-xl hover:bg-[var(--ag-surface)] transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ambient Accent */}
        <div className="h-28 bg-gradient-to-r from-[var(--ag-bg)]/[0.08] via-[var(--ag-bg)]/[0.03] to-transparent border-b border-[var(--ag-border)] relative">
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
                <h2 className="text-xl font-bold text-[var(--ag-text)] glow-text">{profile.fullName}</h2>
                {profile.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-[var(--g-green)]" />
                )}
              </div>
              <p className="text-xs font-medium text-[var(--ag-muted)] mt-0.5">{profile.headline}</p>
              <p className="text-xs text-[var(--ag-muted)] mt-0.5">
                {profile.company} · {profile.experienceYears} Years ({profile.experienceLevel})
              </p>
            </div>

            <div className="flex items-center gap-2">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[var(--ag-surface)] hover:bg-[var(--ag-card)]/[0.1] text-[var(--ag-muted)] hover:text-[var(--ag-text)] border border-[var(--ag-border)] transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[var(--ag-surface)] hover:bg-[var(--ag-card)]/[0.1] text-[var(--ag-muted)] hover:text-[var(--ag-text)] border border-[var(--ag-border)] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-[var(--ag-muted)] uppercase tracking-wider font-mono">
              Engineering Biography
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ag-text)] leading-relaxed bg-[var(--ag-surface)] p-4 rounded-2xl border border-[var(--ag-border)]">
              {profile.bio}
            </p>
          </div>

          {/* Skills and Learning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--ag-surface)] border border-[var(--ag-border)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ag-text)]">
                <Briefcase className="w-3.5 h-3.5 text-[var(--ag-muted)]" />
                <span>Primary Technical Stack</span>
              </div>
              <div className="text-xs text-[var(--ag-muted)] leading-relaxed">
                {profile.skills.map((skill, idx, arr) => (
                  <span key={skill}>
                    <strong className="text-[var(--ag-text)] font-medium">{skill}</strong>
                    {idx < arr.length - 1 && <span className="mx-1.5 text-[var(--ag-faint)]">·</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--ag-surface)] border border-[var(--ag-border)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ag-text)]">
                <GraduationCap className="w-3.5 h-3.5 text-[var(--g-green)]" />
                <span>Currently Researching</span>
              </div>
              <div className="text-xs text-[var(--ag-muted)] leading-relaxed">
                {profile.learning.map((item, idx, arr) => (
                  <span key={item}>
                    <span className="text-[var(--ag-text)]">{item}</span>
                    {idx < arr.length - 1 && <span className="mx-1.5 text-[var(--ag-faint)]">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[var(--ag-muted)] uppercase tracking-wider font-mono">
                Bootcamp Builds & Repositories
              </h3>
              <div className="space-y-2">
                {profile.projects.map((p, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[var(--ag-surface)] border border-[var(--ag-border)] flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[var(--ag-text)]">{p.title}</h4>
                      <p className="text-xs text-[var(--ag-muted)] mt-0.5">{p.desc}</p>
                    </div>
                    <span className="text-xs text-[var(--ag-text)] font-mono flex items-center gap-1 shrink-0">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--ag-border)] flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--ag-muted)]">
              Status: <span className="text-[var(--ag-text)] font-semibold">{profile.connectionStatus.replace('_', ' ')}</span>
            </span>

            {profile.connectionStatus === 'connected' ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToChat(profile.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold text-xs hover:opacity-90 transition-colors flex items-center gap-2"
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
                className="px-5 py-2.5 rounded-xl bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold text-xs hover:opacity-90 transition-colors flex items-center gap-2 shadow-sm"
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
