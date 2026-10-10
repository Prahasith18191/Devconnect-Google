import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AttendeeProfile } from '../../types';
import { X, Lock, Mail, User, Building, Briefcase, ArrowRight, Check, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees?: AttendeeProfile[];
  onAuthSuccess: (userProfile: {
    id: string;
    fullName: string;
    email: string;
    headline: string;
    company: string;
    avatarUrl?: string;
  }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  attendees = [],
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'switch_persona'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Extract clean name from email if not provided
  const deriveNameFromEmail = (rawEmail: string) => {
    const part = rawEmail.split('@')[0] || 'Attendee';
    return part
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'register') {
        const cleanName = fullName.trim() || deriveNameFromEmail(email);
        const cleanHeadline = headline.trim() || 'Software Engineer · AI Builder';
        const cleanCompany = company.trim() || 'Tech Community';

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: cleanName,
              company: cleanCompany,
              headline: cleanHeadline,
            },
          },
        });

        if (error) {
          console.warn('Supabase Auth Notice:', error.message);
        }

        const userId = data?.user?.id || `usr-${Date.now()}`;
        onAuthSuccess({
          id: userId,
          fullName: cleanName,
          email: email.trim(),
          headline: cleanHeadline,
          company: cleanCompany,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
        });
        onClose();
      } else {
        // Sign In Flow
        const cleanEmail = email.trim().toLowerCase();

        // 1. Try to find a matching attendee in existing database attendees
        const matchedAttendee = attendees.find(
          (a) =>
            a.fullName.toLowerCase().includes(cleanEmail.split('@')[0]) ||
            a.company.toLowerCase().includes(cleanEmail.split('@')[0])
        );

        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          console.warn('Supabase Login Notice:', error.message);
        }

        if (matchedAttendee) {
          // Logged in as matching attendee
          onAuthSuccess({
            id: matchedAttendee.id,
            fullName: matchedAttendee.fullName,
            email: cleanEmail,
            headline: matchedAttendee.headline,
            company: matchedAttendee.company,
            avatarUrl: matchedAttendee.avatarUrl,
          });
        } else if (data?.user) {
          // Logged in with Supabase auth metadata
          const metaName = data.user.user_metadata?.full_name || deriveNameFromEmail(cleanEmail);
          onAuthSuccess({
            id: data.user.id,
            fullName: metaName,
            email: cleanEmail,
            headline: data.user.user_metadata?.headline || 'Developer & Builder',
            company: data.user.user_metadata?.company || 'DevConnect AI Community',
          });
        } else {
          // Direct login fallback without defaulting to Prahasith
          const derivedName = deriveNameFromEmail(cleanEmail);
          onAuthSuccess({
            id: `usr-${Date.now()}`,
            fullName: derivedName,
            email: cleanEmail,
            headline: 'Software Engineer',
            company: 'Independent Builder',
          });
        }
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = (attendee: AttendeeProfile) => {
    onAuthSuccess({
      id: attendee.id,
      fullName: attendee.fullName,
      email: `${attendee.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      headline: attendee.headline,
      company: attendee.company,
      avatarUrl: attendee.avatarUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 bg-[#060a14]/95 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] font-mono">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Supabase Auth & Profiles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {mode === 'login'
              ? 'Sign In to DevConnect'
              : mode === 'register'
              ? 'Register as Attendee'
              : 'Choose Persona to Test'}
          </h2>
          <p className="text-xs text-zinc-400">
            {mode === 'login'
              ? 'Enter your credentials, or choose an attendee profile below.'
              : mode === 'register'
              ? 'Create your custom profile for Build with AI Hyderabad.'
              : 'Switch between live attendees to test connection requests and direct messaging.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-center rounded-lg transition-all font-medium ${
              mode === 'login'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-center rounded-lg transition-all font-medium ${
              mode === 'register'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setMode('switch_persona')}
            className={`flex-1 py-2 text-center rounded-lg transition-all font-medium flex items-center justify-center gap-1.5 ${
              mode === 'switch_persona'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Attendee Personas</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Mode 1 & 2: Form */}
        {mode !== 'switch_persona' ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Your Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-xs placeholder-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Company / College</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Google Cloud / Tech"
                        className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-xs placeholder-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Headline / Role</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. AI Engineer"
                        className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-xs placeholder-zinc-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-xs placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-xs placeholder-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black hover:bg-zinc-200 font-semibold text-xs rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Attendee Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Mode 3: Persona Selection */
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Select any attendee from the database to sign in and interact from their account:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  onClick={() => handleSelectPersona(attendee)}
                  className="glass-panel glass-panel-hover p-3 rounded-2xl flex items-center gap-3 cursor-pointer border-white/10 hover:border-white/30 text-left transition-all group"
                >
                  <img
                    src={attendee.avatarUrl}
                    alt={attendee.fullName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-zinc-200">
                      {attendee.fullName}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {attendee.company}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono truncate">
                      {attendee.jobTitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Quick Links */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
          {mode !== 'switch_persona' ? (
            <button
              type="button"
              onClick={() => setMode('switch_persona')}
              className="hover:text-white transition-colors"
            >
              Want to test as another attendee? <strong className="text-white underline">Switch Persona</strong>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="hover:text-white transition-colors"
            >
              Back to <strong className="text-white underline">Standard Login</strong>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
