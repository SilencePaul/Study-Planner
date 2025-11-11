export const STORAGE_KEYS = {
  SESSIONS: '@studyPlanner:sessions',
  ASSIGNMENTS: '@studyPlanner:assignments',
  SETTINGS: '@studyPlanner:settings',
} as const;

export const REMINDER_INTERVALS = [
  { label: 'None', value: undefined },
  { label: '25 minutes', value: 25 },
  { label: '45 minutes', value: 45 },
  { label: '60 minutes', value: 60 },
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

