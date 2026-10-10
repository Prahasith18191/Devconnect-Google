import React from 'react';
import { AttendeeProfile } from '../../types';
import { X, ExternalLink, Github, Linkedin, Globe, Briefcase, GraduationCap, CheckCircle2, MessageSquare, UserPlus } from 'lucide-react';

interface FrameProfileProps {
  profile: AttendeeProfile;
  onClose: () => void;
  onSendConnectionRequest: (attendeeId: string, note: string) => void;
  onNavigateToChat: (attendeeId: string) => void;
}

export const FrameProfile: React.FC<FrameProfileProps> = ({
  profile,
  onClose,
  onSendConnectionRequest,
  onNavigateToChat,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover / Header Accent */}
        <div className="h-28 bg-gradient-to-r from-blue-900 via-slate-800 to-indigo-950 border-b border-slate-700 relative">
          <div className="absolute -bottom-10 left-6">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-12 px-6 pb-6 space-y-6">
          {/* Identity & Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--ag-text)]">{profile.fullName}</h2>
                {profile.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <p className="text-xs font-medium text-[var(--ag-muted)] mt-0.5">{profile.headline}</p>
              <p className="text-xs text-[var(--ag-muted)]">{profile.company} · {profile.experienceYears} Years Exp ({profile.experienceLevel})</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg border border-slate-700 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg border border-slate-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg border border-slate-700 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-[var(--ag-muted)] uppercase tracking-wider font-mono">
              Professional Biography
            </h3>
            <p className="text-sm text-[var(--ag-text)] leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              {profile.bio}
            </p>
          </div>

          {/* Skills & Learning Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ag-muted)]">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Core Technical Skills</span>
              </div>
              <div className="text-xs text-[var(--ag-muted)] leading-relaxed">
                {profile.skills.map((skill, idx, arr) => (
                  <span key={skill}>
                    <strong className="text-[var(--ag-text)] font-medium">{skill}</strong>
                    {idx < arr.length - 1 && <span className="mx-1.5 text-slate-600">·</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ag-muted)]">
                <GraduationCap className="w-3.5 h-3.5 text-[var(--g-green)]" />
                <span>Currently Exploring & Learning</span>
              </div>
              <div className="text-xs text-[var(--ag-muted)] leading-relaxed">
                {profile.learning.map((item, idx, arr) => (
                  <span key={item}>
                    <span className="text-[var(--g-green)]">{item}</span>
                    {idx < arr.length - 1 && <span className="mx-1.5 text-slate-600">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Projects / Code Repo */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[var(--ag-muted)] uppercase tracking-wider font-mono">
                Bootcamp Builds & Projects
              </h3>
              <div className="space-y-2">
                {profile.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--ag-text)]">{proj.title}</h4>
                      <p className="text-xs text-[var(--ag-muted)] mt-0.5">{proj.desc}</p>
                    </div>
                    <span className="text-xs text-blue-400 flex items-center gap-1 font-mono shrink-0">
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-[var(--ag-muted)] font-mono">
              Status: <span className="text-[var(--ag-text)]">{profile.connectionStatus.replace('_', ' ')}</span>
            </span>

            {profile.connectionStatus === 'connected' ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToChat(profile.id);
                }}
                className="px-4 py-2 text-xs font-semibold text-[var(--ag-text)] bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Direct Messages</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onSendConnectionRequest(profile.id, "Hey! Let's connect at Build with AI Hyderabad.");
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-[var(--ag-text)] bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Send Connection Request</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
