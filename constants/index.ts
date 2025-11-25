export const STORAGE_KEYS = {
  SESSIONS: 'study-sessions',
  ASSIGNMENTS: 'assignments', 
  SETTINGS: 'app-settings',
  ACTIVE_TIMERS: 'active-timers', 
} as const;

export const REMINDER_INTERVALS = [
  { label: 'None', value: undefined },
  // seconds options (for quick testing)
  { label: '10 seconds', value: 10 },
  { label: '30 seconds', value: 30 },
  // minute options (stored as seconds)
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 5 * 60 },
  { label: '10 minutes', value: 10 * 60 },
  { label: '15 minutes', value: 15 * 60 },
  { label: '25 minutes', value: 25 * 60 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '45 minutes', value: 45 * 60 },
  { label: '60 minutes', value: 60 * 60 },
] as const;

export const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  theme: 'auto' as const,
  pedometerEnabled: false,
};

export const COMPLETION_THRESHOLDS = {
  GOLD: 1.0, // 100% of tasks completed
  SILVER: 0.5, // 50% or more tasks completed
} as const;

