import * as Notifications from 'expo-notifications';
import { Assignment } from '@/types';
import { getDaysUntilDue } from '@/utils';

// Configure notifications properly
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,       // ← Add this
  } as Notifications.NotificationBehavior),
});

// Improved permission request
export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Check if permissions are granted
export const checkPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

// Improved study reminder scheduling
export const scheduleStudyReminder = async (
  intervalSeconds: number,
  sessionId: string
): Promise<string | null> => {
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      console.warn('Notification permissions not granted');
      return null;
    }

    if (intervalSeconds < 1) {
      console.error('Interval must be at least 1 second');
      return null;
    }

    const identifier = `study-reminder-${sessionId}-${Date.now()}`;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Study Reminder',
        body: `Time to study! You scheduled a reminder every ${
          intervalSeconds >= 60 ? Math.floor(intervalSeconds / 60) + ' minute(s)' : intervalSeconds + ' second(s)'
        }.`,
        sound: 'default',
        data: { 
          sessionId, 
          type: 'study-reminder',
          intervalSeconds 
        },
      },
      trigger: {
        seconds: intervalSeconds,
        repeats: true,
      } as Notifications.TimeIntervalTriggerInput,
    });
    
    console.log('✅ Study reminder scheduled:', identifier, 'every', intervalSeconds, 'seconds');
    return identifier;
  } catch (error) {
    console.error('❌ Error scheduling study reminder:', error);
    return null;
  }
};

// Improved cancellation with better filtering
export const cancelStudyReminders = async (sessionId: string): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    const studyReminders = scheduledNotifications.filter(notification => {
      const data = notification.content.data as any;
      return data?.sessionId === sessionId && data?.type === 'study-reminder';
    });
    
    for (const reminder of studyReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
      console.log('Cancelled reminder:', reminder.identifier);
    }
    
  } catch (error) {
    console.error('Error cancelling study reminders:', error);
    throw error;
  }
};

// Update function
export const updateStudyReminder = async (
  sessionId: string, 
  intervalSeconds: number | undefined
): Promise<string | null> => {
  try {
    await cancelStudyReminders(sessionId);
    
    if (!intervalSeconds || intervalSeconds < 1) {
      console.log('Study reminders cancelled for session:', sessionId);
      return null;
    }
    
    return await scheduleStudyReminder(intervalSeconds, sessionId);
  } catch (error) {
    console.error('Error updating study reminder:', error);
    return null;
  }
};

// Improved assignment reminders with proper date triggers
export const scheduleAssignmentReminders = async (assignments: Assignment[]): Promise<void> => {
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      console.warn('Cannot schedule assignment reminders - permissions not granted');
      return;
    }

    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const assignmentReminders = scheduledNotifications.filter(notification => {
      const data = notification.content.data as any;
      return data?.type === 'assignment-reminder';
    });
    
    for (const reminder of assignmentReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    const now = Date.now();
    
    for (const assignment of assignments) {
      const daysUntilDue = getDaysUntilDue(assignment.dueDate);
      
      // Schedule reminder 1 day before due date
      if (daysUntilDue === 1) {
        const dueDate = new Date(assignment.dueDate);
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(reminderDate.getDate() - 1);
        reminderDate.setHours(9, 0, 0, 0); // 9 AM day before
        
        if (reminderDate.getTime() > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '📝 Assignment Due Tomorrow!',
              body: `${assignment.name} is due tomorrow!`,
              sound: 'default',
              data: { 
                assignmentId: assignment.id, 
                type: 'assignment-reminder' 
              },
            },
            trigger: {
              date: reminderDate.getTime(),
            } as Notifications.DateTriggerInput,
          });
          console.log('Scheduled tomorrow reminder for:', assignment.name);
        }
      }
      
      // Schedule reminder on due date
      if (daysUntilDue === 0) {
        const dueDate = new Date(assignment.dueDate);
        dueDate.setHours(9, 0, 0, 0); // 9 AM on due date
        
        if (dueDate.getTime() > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '📝 Assignment Due Today!',
              body: `${assignment.name} is due today!`,
              sound: 'default',
              data: { 
                assignmentId: assignment.id, 
                type: 'assignment-reminder' 
              },
            },
            trigger: {
              date: dueDate.getTime(),
            } as Notifications.DateTriggerInput,
          });
          console.log('Scheduled today reminder for:', assignment.name);
        }
      }
    }
  } catch (error) {
    console.error('Error scheduling assignment reminders:', error);
    throw error;
  }
};

// Single notification cancellation
export const cancelNotification = async (identifier: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error cancelling notification:', error);
    throw error;
  }
};

// Cancel all notifications (useful for logout/reset)
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
    throw error;
  }
};

// Initialize notifications
export const initializeNotifications = async (): Promise<boolean> => {
  return await requestPermissions();
};

// Get all scheduled notifications (for debugging)
export const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};