export interface Task {
  id: string;
  name: string;
  goal: 'full' | 'partial';
  completed: boolean;
  description?: string;
  assignmentId?: string;
}

export interface Session {
  id: string;
  date: string; // ISO date string
  duration: number; // in minutes
  tasks: Task[];
  reminderInterval?: number; // minutes: 25, 45, 60, or undefined
}

export interface Assignment {
  id: string;
  name: string;
  dueDate: string; // ISO date string
  progress: number; // 0-100
}

export type CompletionStatus = 'gold' | 'silver' | 'red';

export interface AppState {
  sessions: Session[];
  assignments: Assignment[];
  settings: {
    notificationsEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
    pedometerEnabled: boolean;
  };
}

export type ActionType =
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'UPDATE_DURATION'; payload: { sessionId: string; duration: number } }
  | { type: 'TOGGLE_TASK_COMPLETE'; payload: { sessionId: string; taskId: string } }
  | { type: 'ADD_TASK'; payload: { sessionId: string; task: Task } }
  | { type: 'DELETE_TASK'; payload: { sessionId: string; taskId: string } }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'DELETE_ASSIGNMENT'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'LOAD_STATE'; payload: AppState };

