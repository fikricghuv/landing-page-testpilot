import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DiscoveryContextType {
  isOpen: boolean;
  openDiscovery: () => void;
  closeDiscovery: () => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDiscovery = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDiscovery = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DiscoveryContext.Provider value={{ isOpen, openDiscovery, closeDiscovery }}>
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscovery = (): DiscoveryContextType => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
};
