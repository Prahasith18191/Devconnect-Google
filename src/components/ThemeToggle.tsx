import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/** Light/Dark toggle — flips [data-theme] on <html> and persists the choice. */
export const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('devconnect_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return false; }
  });

  useEffect(() => {
    const t = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('devconnect_theme', t); } catch { /* ignore */ }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      title={dark ? 'Switch to light' : 'Switch to dark'}
      aria-label="Toggle theme"
      className="p-2 rounded-full text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-[var(--ag-surface)] transition-colors"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
