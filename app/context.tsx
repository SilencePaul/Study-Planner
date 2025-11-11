import React, { createContext, useContext } from 'react';
import { AppState, ActionType } from '@/types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContext.Provider');
  }
  return context;
};

