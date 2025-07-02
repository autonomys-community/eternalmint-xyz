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
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('nft-depth-enabled');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === 'boolean') {
            setDepthEnabled(parsed);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load depth preference from localStorage:', error);
      // Fall back to default value (false)
    }
  }, []);

  // Save preference to localStorage when changed
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('nft-depth-enabled', JSON.stringify(depthEnabled));
      }
    } catch (error) {
      console.warn('Failed to save depth preference to localStorage:', error);
    }
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