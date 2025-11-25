import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '@/types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/constants';

export const loadState = async (): Promise<AppState> => {
  try {
    const [sessionsData, assignmentsData, settingsData, timersData, gamificationData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
      AsyncStorage.getItem(STORAGE_KEYS.ASSIGNMENTS),
      AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TIMERS),
      AsyncStorage.getItem('gamification'),
    ]);

    const gamification = gamificationData ? JSON.parse(gamificationData) : { xp: 0, level: 0 };

    return {
      sessions: sessionsData ? JSON.parse(sessionsData) : [],
      assignments: assignmentsData ? JSON.parse(assignmentsData) : [],
      settings: settingsData ? JSON.parse(settingsData) : DEFAULT_SETTINGS,
      activeTimers: timersData ? JSON.parse(timersData) : {},
      xp: typeof gamification.xp === 'number' ? gamification.xp : 0,
      level: typeof gamification.level === 'number' ? gamification.level : 0,
    };
  } catch (error) {
    console.error('Error loading state:', error);
    return {
      sessions: [],
      assignments: [],
      settings: DEFAULT_SETTINGS,
      activeTimers: {}, // Initial state
      xp: 0,
      level: 0,
    };
  }
};

export const saveState = async (state: AppState): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(state.sessions)),
      AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(state.assignments)),
      AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings)),
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_TIMERS, JSON.stringify(state.activeTimers)), // Add this line
      AsyncStorage.setItem('gamification', JSON.stringify({ xp: state.xp || 0, level: state.level || 0 })),
    ]);
  } catch (error) {
    console.error('Error saving state:', error);
  }
};