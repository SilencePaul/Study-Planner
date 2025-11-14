import { Stack } from 'expo-router';
import { useEffect, useReducer } from 'react';
import { AppState, ActionType } from '@/types';
import { appReducer, initialState } from '@/features/reducer';
import { loadState } from '@/services/storage';
import { AppContext } from './context';
import { ThemeProvider } from '@/theme/context';

// main wrapper component that initializes the app's global state

export default function RootLayout() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadState()
      .then((loadedState) => {
        dispatch({ type: 'LOAD_STATE', payload: loadedState });
      })
      .catch((error) => {
        console.error('Error loading state:', error);
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
        >
          {/* Define all screens here */}
          <Stack.Screen 
            name="index" 
            options={{
              title: 'Study Sessions',
              headerShown: true,
            }} 
          />
          
          {/* Assignments screens */}
          <Stack.Screen 
            name="assignments/index" 
            options={{
              title: 'Assignments',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="assignments/[id]" 
            options={{
              title: 'Assignment Details',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="assignments/new" 
            options={{
              title: 'New Assignment',
              headerShown: true,
            }} 
          />
          
          {/* Detail screens */}
          <Stack.Screen 
            name="Detail/[id]" 
            options={{
              title: 'Detail View',
              headerShown: true,
            }} 
          />
          
          {/* Session screens */}
          <Stack.Screen 
            name="session/add" 
            options={{
              title: 'Add Today Task',
              headerShown: true,
            }} 
          />
          
          {/* Settings screen */}
          <Stack.Screen 
            name="settings/index" 
            options={{
              title: 'Settings',
              headerShown: true,
            }} 
          />
          
          {/* Not Found screen */}
          <Stack.Screen 
            name="+not-found" 
            options={{
              title: 'Not Found',
              headerShown: true,
            }} 
          />
        </Stack>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
