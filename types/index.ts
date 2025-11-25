export interface Task {
  id: string;
  name: string;
  goal: 'full' | 'partial';
  completed: boolean;
  description?: string;
  assignmentId?: string;
  partialPercent?: number; 
}

export interface Session {
  id: string;
  date: string;
  duration: number; 
  
  tasks: Task[];
  reminderInterval?: number; 
}

export interface Assignment {
  id: string;
  name: string;
  dueDate: string; 
  progress: number; 
}

export type CompletionStatus = 'gold' | 'silver' | 'red';

export interface AppState {
  sessions: Session[];
  assignments: Assignment[];
  activeTimers: { [sessionId: string]: number };
  settings: {
    notificationsEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
    pedometerEnabled: boolean;
  };
  // Gamification
  xp?: number;
  level?: number;
}

export type ActionType =
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'UPDATE_DURATION'; payload: { sessionId: string; duration: number } }
  | { type: 'UPDATE_REMINDER_INTERVAL'; payload: { sessionId: string; interval: number | undefined } }
  | { type: 'TOGGLE_TASK_COMPLETE'; payload: { sessionId: string; taskId: string } }
  | { type: 'ADD_TASK'; payload: { sessionId: string; task: Task } }
  | { type: 'DELETE_TASK'; payload: { sessionId: string; taskId: string } }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'DELETE_ASSIGNMENT'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'LOAD_STATE'; payload: AppState }
    // timer actions 
  | { type: 'SET_TIMER'; payload: { sessionId: string; seconds: number } }
  | { type: 'INCREMENT_TIMER'; payload: { sessionId: string } }
  | { type: 'RESET_TIMER'; payload: { sessionId: string } }
  | { type: 'UPDATE_ASSIGNMENT_PROGRESS'; payload: { assignmentId: string; progress: number } };

