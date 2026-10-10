import React from 'react';
import { Bell, User, LogOut, Compass, Users, Sparkles, MessageSquare, Radio, Shield } from 'lucide-react';

export type AppView = 'landing' | 'directory' | 'feed' | 'lounge' | 'messages' | 'admin';

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

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenAuth,
  currentUser,
  onSignOut,
  connectedCount,
}) => {
  const navLinks = [
    { id: 'landing' as AppView, label: 'Event & Agenda' },
    { id: 'directory' as AppView, label: 'Attendees' },
    { id: 'feed' as AppView, label: 'Community Feed' },
    { id: 'lounge' as AppView, label: 'Event Lounge' },
    { id: 'messages' as AppView, label: 'Direct Messages' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#030712]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand (Clean Google-inspired logo + title) */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Subtle Google 4-color micro accent bar or clean icon */}
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/15 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm group-hover:border-white/30 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">
              DevConnect AI
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean Arial Typography, no clutter) */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Notification Bell & Account Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
                title="Click to switch profile or view account"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-bold text-white">
                    {currentUser.fullName.charAt(0)}
                  </div>
                )}
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <span className="font-semibold text-white block">{currentUser.fullName}</span>
                  <span className="text-[10px] text-zinc-400">{connectedCount} Connected</span>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Sign In
            </button>
          )}

          {/* Admin Link */}
          <button
            onClick={() => setCurrentView('admin')}
            className={`p-2 rounded-xl border transition-colors ${
              currentView === 'admin'
                ? 'bg-white text-black border-white'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'
            }`}
            title="Admin Dashboard"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Submenu */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 border-t border-white/[0.06] overflow-x-auto bg-black/60">
        {navLinks.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
