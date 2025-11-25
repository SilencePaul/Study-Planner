import { AppState, ActionType, Session, Task, Assignment } from '@/types';
import { generateId } from '@/utils';

// Calculate assignment progress
const calculateAssignmentProgress = (state: AppState, assignmentId: string): number => {
  const allAssignmentTasks = state.sessions.flatMap(s => s.tasks.filter(t => t.assignmentId === assignmentId));

  // If any completed full task exists, assignment is 100%
  const hasCompletedFull = allAssignmentTasks.some(t => t.goal === 'full' && t.completed);
  if (hasCompletedFull) return 100;

  // Partial Percent
  const partialSum = allAssignmentTasks
    .filter(t => t.goal === 'partial' && t.completed)
    .reduce((acc, t) => acc + (typeof t.partialPercent === 'number' ? t.partialPercent : 50), 0);

  return Math.max(0, Math.min(100, partialSum));
};

export const initialState: AppState = {
  sessions: [],
  assignments: [],
  settings: {
    notificationsEnabled: true,
    theme: 'auto',
    pedometerEnabled: false,
  },
  activeTimers: {}, 
  xp: 0,
  level: 0,
};

export const appReducer = (state: AppState, action: ActionType): AppState => {
  let newState: AppState;

  switch (action.type) {
    case 'ADD_SESSION':
      newState = {
        ...state,
        sessions: [...state.sessions, action.payload],
        activeTimers: {
          ...state.activeTimers,
          [action.payload.id]: 0 
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
      delete newActiveTimers[action.payload]; 
      newState = {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        activeTimers: newActiveTimers,
      };
      break;

    // New timer actions
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

    case 'UPDATE_DURATION':

      const updatedSessions = state.sessions.map(s =>
        s.id === action.payload.sessionId
          ? { ...s, duration: action.payload.duration }
          : s
      );

        newState = {
          ...state,
          sessions: updatedSessions,
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
      // Toggle the task completion inside sessions
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

      const toggledSessionBefore = state.sessions.find(s => s.id === action.payload.sessionId);
      const toggledTaskBefore = toggledSessionBefore?.tasks.find(t => t.id === action.payload.taskId);

      let updatedAssignments = state.assignments;
      if (toggledTaskBefore && toggledTaskBefore.assignmentId) {
        const assignmentId = toggledTaskBefore.assignmentId;

        const tempState: AppState = { ...state, sessions: sessionsWithToggledTask };
        const newProgress = calculateAssignmentProgress(tempState, assignmentId);

        updatedAssignments = state.assignments.map(a =>
          a.id === assignmentId ? { ...a, progress: newProgress } : a
        );
      }

      // Award XP for newly completed tasks (only when toggled to completed)
      let newXp = state.xp || 0;
      const toggledSessionAfter = sessionsWithToggledTask.find(s => s.id === action.payload.sessionId);
      const toggledTaskAfter = toggledSessionAfter?.tasks.find(t => t.id === action.payload.taskId);
      if (toggledTaskAfter && toggledTaskAfter.completed) {
        const baseFullXp = 100;
        if (toggledTaskAfter.goal === 'full') {
          newXp += baseFullXp;
        } else {
          const pct = typeof toggledTaskAfter.partialPercent === 'number' ? toggledTaskAfter.partialPercent : 50;
          newXp += Math.round(baseFullXp * (pct / 100));
        }
      }

      const newLevel = Math.floor((newXp || 0) / 500);

      newState = {
        ...state,
        sessions: sessionsWithToggledTask,
        assignments: updatedAssignments,
        xp: newXp,
        level: newLevel,
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

    case 'ADD_TASK': {
      const sessionsWithAddedTask = state.sessions.map(s =>
        s.id === action.payload.sessionId
          ? { ...s, tasks: [...s.tasks, action.payload.task] }
          : s
      );

      let updatedAssignmentsAdd = state.assignments;
      if (action.payload.task.assignmentId) {
        const tempState: AppState = { ...state, sessions: sessionsWithAddedTask };
        const newProgress = calculateAssignmentProgress(tempState, action.payload.task.assignmentId);
        updatedAssignmentsAdd = state.assignments.map(a =>
          a.id === action.payload.task.assignmentId ? { ...a, progress: newProgress } : a
        );
      }

      newState = {
        ...state,
        sessions: sessionsWithAddedTask,
        assignments: updatedAssignmentsAdd,
      };
      break;
    }

    case 'DELETE_TASK': {
      // Remove the task
      const sessionsWithDeletedTask = state.sessions.map(s =>
        s.id === action.payload.sessionId
          ? { ...s, tasks: s.tasks.filter(t => t.id !== action.payload.taskId) }
          : s
      );

      const sessionBefore = state.sessions.find(s => s.id === action.payload.sessionId);
      const deletedTask = sessionBefore?.tasks.find(t => t.id === action.payload.taskId);

      let updatedAssignmentsDel = state.assignments;
      if (deletedTask && deletedTask.assignmentId) {
        const tempState: AppState = { ...state, sessions: sessionsWithDeletedTask };
        const newProgress = calculateAssignmentProgress(tempState, deletedTask.assignmentId);
        updatedAssignmentsDel = state.assignments.map(a =>
          a.id === deletedTask.assignmentId ? { ...a, progress: newProgress } : a
        );
      }

      newState = {
        ...state,
        sessions: sessionsWithDeletedTask,
        assignments: updatedAssignmentsDel,
      };
      break;
    }

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
      break;


    default:
      return state;
  }

  
  return newState;
};

