import React from 'react';
import { Bell, LogOut, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type AppView = 'landing' | 'directory' | 'feed' | 'lounge' | 'messages' | 'admin';

export const ADMIN_EMAIL = 'prahasith.naru@kellton.com';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  currentUser: {
    id: string;
    fullName: string;
    headline: string;
    avatarUrl?: string;
    email?: string;
  } | null;
  onSignOut: () => void;
  connectedCount: number;
}

const GoogleMark = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.33 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  currentView, setCurrentView, unreadNotificationsCount, onOpenNotifications,
  onOpenAuth, currentUser, onSignOut, connectedCount,
}) => {
  const isAdmin = (currentUser?.email || '').trim().toLowerCase() === ADMIN_EMAIL;
  const navLinks = [
    { id: 'landing' as AppView, label: 'Event' },
    { id: 'directory' as AppView, label: 'Attendees' },
    { id: 'feed' as AppView, label: 'Community' },
    { id: 'lounge' as AppView, label: 'Lounge' },
    { id: 'messages' as AppView, label: 'Messages' },
  ];

  const linkClass = (active: boolean) =>
    `px-3.5 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
      active ? 'bg-[var(--ag-surface-2)] text-[var(--ag-text)]' : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-[var(--ag-surface)]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[var(--ag-bg)]/80 backdrop-blur-xl border-b border-[var(--ag-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <div onClick={() => setCurrentView('landing')} className="flex items-center gap-2.5 cursor-pointer shrink-0">
          <GoogleMark />
          <span className="text-[17px] font-bold text-[var(--ag-text)] tracking-tight">DevConnect AI</span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => (
            <button key={item.id} onClick={() => setCurrentView(item.id)} className={linkClass(currentView === item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <button onClick={onOpenNotifications} title="Notifications"
            className="relative p-2 rounded-full text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-[var(--ag-surface)] transition-colors">
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#ea4335] text-[var(--ag-text)] font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <button onClick={() => setCurrentView('admin')} title="Admin dashboard"
              className={`p-2 rounded-full border transition-colors ${
                currentView === 'admin' ? 'bg-[#1f1f1f] text-[var(--ag-text)] border-[#1f1f1f]'
                  : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)] border-[var(--ag-border)] hover:bg-[var(--ag-surface)]'}`}>
              <Shield className="w-4 h-4" />
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <div onClick={onOpenAuth} title="Your account"
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[var(--ag-border)] hover:bg-[var(--ag-surface)] cursor-pointer transition-colors">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#4285F4] flex items-center justify-center text-[12px] font-bold text-[var(--ag-text)]">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left leading-tight">
                  <span className="font-semibold text-[var(--ag-text)] text-xs block">{currentUser.fullName}</span>
                  <span className="text-[10px] text-[var(--ag-muted)]">{connectedCount} connected</span>
                </div>
              </div>
              <button onClick={onSignOut} title="Sign out"
                className="p-2 text-[var(--ag-muted)] hover:text-[#ea4335] rounded-full hover:bg-[var(--ag-surface)] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="ag-btn-dark px-5 py-2 text-sm font-semibold">
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Mobile submenu */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 border-t border-[var(--ag-border)] overflow-x-auto">
        {navLinks.map((item) => (
          <button key={item.id} onClick={() => setCurrentView(item.id)}
            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
              currentView === item.id ? 'bg-[var(--ag-surface-2)] text-[var(--ag-text)]' : 'text-[var(--ag-muted)]'}`}>
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
