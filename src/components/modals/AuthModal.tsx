import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Lock, Mail, User, Building, Briefcase, ArrowRight, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Real Supabase email/password auth. Register uploads an optional profile photo to the
 *  `avatars` bucket and fills the profile; the App's auth listener loads the session. */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [headline, setHeadline] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setAvatarFile(f);
    setAvatarPreview(f ? URL.createObjectURL(f) : null);
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    const ext = (avatarFile.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true });
    if (upErr) { console.warn('avatar upload', upErr.message); return null; }
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setNotice(null);
    try {
      if (mode === 'register') {
        const name = fullName.trim();
        const { data, error: signErr } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { full_name: name, company: company.trim(), headline: headline.trim() } },
        });
        if (signErr) { setError(signErr.message); return; }

        // Establish a session (works when email confirmation is OFF)
        let session = data.session;
        if (!session) {
          const { data: li } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
          session = li.session;
        }
        if (!session?.user) {
          setNotice('Account created. Please confirm your email, then sign in.');
          setMode('login'); return;
        }
        const avatarUrl = await uploadAvatar(session.user.id);
        await supabase.from('profiles').update({
          full_name: name, company: company.trim(), headline: headline.trim(),
          ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        }).eq('id', session.user.id);
        onClose(); // App's onAuthStateChange loads the profile
      } else {
        const { error: liErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (liErr) { setError(liErr.message === 'Invalid login credentials' ? 'Incorrect email or password.' : liErr.message); return; }
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
        className="ag-card w-full max-w-md p-7 sm:p-8 relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-full hover:bg-[var(--ag-surface)]">
          <X className="w-5 h-5" />
        </button>

        <h2 className="ag-display text-2xl font-bold text-[var(--ag-text)]">
          {mode === 'login' ? 'Welcome back' : 'Join DevConnect'}
        </h2>
        <p className="text-sm text-[var(--ag-muted)] mt-1 mb-6">
          {mode === 'login' ? 'Sign in to network at Build with AI, Hyderabad.' : 'Create your attendee profile to connect & chat.'}
        </p>

        <div className="flex p-1 rounded-full bg-[var(--ag-surface)] border border-[var(--ag-border)] text-sm mb-6">
          {(['login', 'register'] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(null); setNotice(null); }}
              className={`flex-1 py-2 rounded-full font-medium transition-all ${mode === m ? 'bg-[var(--ag-card)] text-[var(--ag-text)] shadow-sm' : 'text-[var(--ag-muted)]'}`}>
              {m === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-[#fce8e6] text-[#c5221f] text-sm">{error}</div>}
        {notice && <div className="mb-4 p-3 rounded-xl bg-[#e6f4ea] text-[#137333] text-sm">{notice}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="relative w-16 h-16 rounded-full border border-[var(--ag-border)] bg-[var(--ag-surface)] overflow-hidden grid place-items-center shrink-0 hover:border-[var(--ag-border-strong)]">
                  {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    : <Camera className="w-5 h-5 text-[var(--ag-faint)]" />}
                </button>
                <div className="text-xs text-[var(--ag-muted)]">
                  <button type="button" onClick={() => fileRef.current?.click()} className="font-semibold text-[var(--ag-text)] underline">Upload a profile photo</button>
                  <div>JPG/PNG · optional</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPickPhoto} className="hidden" />
              </div>
              <Field icon={User}><input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field icon={Building}><input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company / college" className={inputCls} /></Field>
                <Field icon={Briefcase}><input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Role / headline" className={inputCls} /></Field>
              </div>
            </>
          )}
          <Field icon={Mail}><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputCls} /></Field>
          <Field icon={Lock}><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputCls} /></Field>

          <button type="submit" disabled={loading} className="ag-btn-dark w-full py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 mt-1 disabled:opacity-60">
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Field: React.FC<{ icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <div className="relative">
    <Icon className="w-4 h-4 text-[var(--ag-faint)] absolute left-3 top-1/2 -translate-y-1/2 z-10" />
    {children}
  </div>
);
