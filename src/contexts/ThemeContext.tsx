
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isTransitioning: boolean;
  triggerThemeAnimation: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [isDark, setIsDark] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const createThemeRipple = (event?: React.MouseEvent, newTheme?: boolean) => {
    if (!event) return;

    const ripple = document.createElement('div');
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.className = `theme-ripple ${newTheme ? 'dark' : 'light'}`;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.left + x) + 'px';
    ripple.style.top = (rect.top + y) + 'px';

    document.body.appendChild(ripple);

    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 600);
  };

  const triggerThemeAnimation = (event?: React.MouseEvent) => {
    setIsTransitioning(true);

    // Create ripple effect
    createThemeRipple(event, !isDark);

    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.className = `theme-transition-overlay ${isDark ? 'dark' : ''} active`;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      }, 300);
    }, 150);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(shouldBeDark);

      // Add smooth transition class to body
      document.body.classList.add('smooth-colors');

      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, isTransitioning, triggerThemeAnimation }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
