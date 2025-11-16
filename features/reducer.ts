import { AppState, ActionType, Session, Task, Assignment } from '@/types';
import { generateId } from '@/utils';

// reducer

export const initialState: AppState = {
  sessions: [],
  assignments: [],
  settings: {
    notificationsEnabled: true,
    theme: 'auto',
    pedometerEnabled: false,
  },
  activeTimers: {}, // Add this for timmer initial
};

export const appReducer = (state: AppState, action: ActionType): AppState => {
  let newState: AppState;

  switch (action.type) {
    case 'ADD_SESSION':
      newState = {
        ...state,
        sessions: [...state.sessions, action.payload],
        activeTimers: { // for timer
          ...state.activeTimers,
          [action.payload.id]: 0 // Initialize timer for new session
        },
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
      const newActiveTimers = { ...state.activeTimers };
      delete newActiveTimers[action.payload]; // Remove timer when session is deleted
      
      newState = {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        activeTimers: newActiveTimers,
      };
      break;

    // Add these new timer cases:
    case 'SET_TIMER':
      newState = {
        ...state,
        activeTimers: {
          ...state.activeTimers,
          [action.payload.sessionId]: action.payload.seconds
        },
      };
      break;

    case 'INCREMENT_TIMER':
      const currentSeconds = state.activeTimers[action.payload.sessionId] || 0;
      newState = {
        ...state,
        activeTimers: {
          ...state.activeTimers,
          [action.payload.sessionId]: currentSeconds + 1
        },
      };
      break;

    case 'RESET_TIMER':
      newState = {
        ...state,
        activeTimers: {
          ...state.activeTimers,
          [action.payload.sessionId]: 0
        },
      };
      break;
    //

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

    // Update reminder interval
    case 'UPDATE_REMINDER_INTERVAL':
      newState = {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.sessionId
            ? { ...session, reminderInterval: action.payload.interval }
            : session
        )
      };
      break;
      
    case 'TOGGLE_TASK_COMPLETE': {
      // Find the task before toggling to know its current state
      const session = state.sessions.find(s => s.id === action.payload.sessionId);
      const task = session?.tasks.find(t => t.id === action.payload.taskId);
      const currentCompletedState = task?.completed || false;
      
      // First toggle the task completion
      const sessionsWithToggledTask = state.sessions.map(s =>
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
      );

      // Update assignment progress if this task is linked to an assignment
      let updatedAssignments = [...state.assignments];
      if (task && task.assignmentId) {
        const assignment = state.assignments.find(a => a.id === task.assignmentId);
        if (assignment) {
          const progressChange = task.goal === 'full' ? 100 : 50;
          const newProgress = currentCompletedState 
            ? // If marking as incomplete (was completed, now uncompleting), decrease progress
              Math.max(0, assignment.progress - progressChange)
            : // If marking as complete (was incomplete, now completing), increase progress
              Math.min(100, assignment.progress + progressChange);
          
          updatedAssignments = state.assignments.map(a =>
            a.id === task.assignmentId
              ? { ...a, progress: newProgress }
              : a
          );
        }
      }

      newState = {
        ...state,
        sessions: sessionsWithToggledTask,
        assignments: updatedAssignments,
      };
      break;
    }
    
    case 'UPDATE_ASSIGNMENT_PROGRESS':
      newState = {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.assignmentId
            ? { ...assignment, progress: action.payload.progress }
            : assignment
        )
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
      newState = {
        ...action.payload,
        activeTimers: action.payload.activeTimers || {},
      };
      break;


    default:
      return state;
  }

  
  return newState;
};

