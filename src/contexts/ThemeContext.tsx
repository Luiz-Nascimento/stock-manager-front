// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';


type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Tenta pegar o tema do localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    // 2. Se não tiver, usa a preferência do navegador
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement; // <html>
    
    // Remove a classe oposta
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    // Adiciona a classe atual
    root.classList.add(theme);

    // Salva a preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};