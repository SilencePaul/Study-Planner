import * as Notifications from 'expo-notifications';
import { Assignment } from '@/types';
import { getDaysUntilDue } from '@/utils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const scheduleStudyReminder = async (
  intervalMinutes: number,
  sessionId: string
): Promise<string | null> => {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Study Reminder',
        body: `Take a break! You've been studying for ${intervalMinutes} minutes.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: intervalMinutes * 60,
        repeats: false,
      },
    });
    return identifier;
  } catch (error) {
    console.error('Error scheduling study reminder:', error);
    return null;
  }
};

export const scheduleAssignmentReminders = async (
  assignments: Assignment[]
): Promise<void> => {
  // Cancel all existing assignment reminders
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  const now = Date.now();
  
  for (const assignment of assignments) {
    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
    
    // Schedule reminder 3 days before due date
    if (daysUntilDue === 3) {
      const dueDate = new Date(assignment.dueDate);
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() - 3);
      
      if (reminderDate.getTime() > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Assignment Due Soon',
            body: `${assignment.name} is due in 3 days!`,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderDate,
          },
        });
      }
    }
  }
};

export const cancelNotification = async (identifier: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(identifier);
};

