import { AppState, ActionType, Session, Task, Assignment } from '@/types';
import { generateId } from '@/utils';
import { saveState } from '@/services/storage';

export const initialState: AppState = {
  sessions: [],
  assignments: [],
  settings: {
    notificationsEnabled: true,
    theme: 'auto',
    pedometerEnabled: false,
  },
};

export const appReducer = (state: AppState, action: ActionType): AppState => {
  let newState: AppState;

  switch (action.type) {
    case 'ADD_SESSION':
      newState = {
        ...state,
        sessions: [...state.sessions, action.payload],
      };
      break;

    case 'UPDATE_SESSION':
      newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
      break;

    case 'DELETE_SESSION':
      newState = {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
      };
      break;

    case 'UPDATE_DURATION':
      newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? { ...s, duration: action.payload.duration }
            : s
        ),
      };
      break;

    case 'TOGGLE_TASK_COMPLETE':
      newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                tasks: s.tasks.map(t =>
                  t.id === action.payload.taskId
                    ? { ...t, completed: !t.completed }
                    : t
                ),
              }
            : s
        ),
      };
      break;

    case 'ADD_TASK':
      newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? { ...s, tasks: [...s.tasks, action.payload.task] }
            : s
        ),
      };
      break;

    case 'DELETE_TASK':
      newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                tasks: s.tasks.filter(t => t.id !== action.payload.taskId),
              }
            : s
        ),
      };
      break;

    case 'ADD_ASSIGNMENT':
      newState = {
        ...state,
        assignments: [...state.assignments, action.payload],
      };
      break;

    case 'UPDATE_ASSIGNMENT':
      newState = {
        ...state,
        assignments: state.assignments.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
      break;

    case 'DELETE_ASSIGNMENT':
      newState = {
        ...state,
        assignments: state.assignments.filter(a => a.id !== action.payload),
      };
      break;

    case 'UPDATE_SETTINGS':
      newState = {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      break;

    case 'LOAD_STATE':
      newState = action.payload;
      break;

    default:
      return state;
  }

  // Persist state to AsyncStorage
  saveState(newState).catch(console.error);

  return newState;
};

