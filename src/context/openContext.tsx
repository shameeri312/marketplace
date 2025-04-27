// src/context/OpenContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface OpenContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const OpenContext = createContext<OpenContextType | undefined>(undefined);

export const OpenProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OpenContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </OpenContext.Provider>
  );
};

export const useOpen = () => {
  const context = useContext(OpenContext);
  if (!context) {
    throw new Error('useOpen must be used within an OpenProvider');
  }
  return context;
};
