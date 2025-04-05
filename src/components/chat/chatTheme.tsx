// components/ChatThemeContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ChatThemeContext = createContext<ChatThemeContextType | undefined>(
  undefined
);

export function ChatThemeProvider({
  children,
  initialTheme = 'light',
}: {
  children: ReactNode;
  initialTheme?: 'light' | 'dark';
}) {
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ChatThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ChatThemeContext.Provider>
  );
}

export const useChatTheme = () => {
  const context = useContext(ChatThemeContext);
  if (!context) {
    throw new Error('useChatTheme must be used within a ChatThemeProvider');
  }
  return context;
};
