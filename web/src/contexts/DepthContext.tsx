"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface DepthContextType {
  depthEnabled: boolean;
  toggleDepth: () => void;
}

const DepthContext = createContext<DepthContextType | undefined>(undefined);

export const useDepth = () => {
  const context = useContext(DepthContext);
  if (context === undefined) {
    throw new Error('useDepth must be used within a DepthProvider');
  }
  return context;
};

interface DepthProviderProps {
  children: ReactNode;
}

export const DepthProvider: React.FC<DepthProviderProps> = ({ children }) => {
  const [depthEnabled, setDepthEnabled] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nft-depth-enabled');
    if (saved !== null) {
      setDepthEnabled(JSON.parse(saved));
    }
  }, []);

  // Save preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('nft-depth-enabled', JSON.stringify(depthEnabled));
  }, [depthEnabled]);

  const toggleDepth = () => {
    setDepthEnabled(prev => !prev);
  };

  return (
    <DepthContext.Provider value={{ depthEnabled, toggleDepth }}>
      {children}
    </DepthContext.Provider>
  );
}; 