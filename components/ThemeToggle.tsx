'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-[80px] h-[40px] rounded-lg" style={{ backgroundColor: 'var(--color-fm-surface)' }} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 px-5 py-3 rounded-xl transition-colors border"
      style={{
        backgroundColor: 'var(--color-fm-surface)',
        borderColor: 'var(--color-fm-border)'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-fm-surface-elevated)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-fm-surface)'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-fm-text-secondary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-sm font-medium" style={{ color: 'var(--color-fm-text-secondary)' }}>Light</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-fm-text-secondary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span className="text-sm font-medium" style={{ color: 'var(--color-fm-text-secondary)' }}>Dark</span>
        </>
      )}
    </button>
  );
}

