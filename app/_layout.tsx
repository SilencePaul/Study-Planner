import { Stack } from 'expo-router';
import { useEffect, useReducer } from 'react';
import { AppState, ActionType } from '@/types';
import { appReducer, initialState } from '@/features/reducer';
import { loadState } from '@/services/storage';
import { AppContext } from './context';
import { ThemeProvider } from '@/theme/context';

export default function RootLayout() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load state from AsyncStorage on app start
    loadState()
      .then((loadedState) => {
        dispatch({ type: 'LOAD_STATE', payload: loadedState });
      })
      .catch((error) => {
        console.error('Error loading state:', error);
        // Continue with initial state if loading fails
      });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </ThemeProvider>
    </AppContext.Provider>
  );
}

