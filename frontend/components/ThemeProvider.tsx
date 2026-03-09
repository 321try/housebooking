'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
