import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { Session, Task } from '@/types';
import { formatDate, formatTimer, getCompletionStatus } from '@/utils';
import { REMINDER_INTERVALS } from '@/constants';
import { fetchStudyTip } from '@/services/api';
import { scheduleStudyReminder, requestPermissions } from '@/services/notifications';
import { startPedometerTracking, suggestBreak } from '@/services/pedometer';
import { Badge } from '@/components/Badge';
import { lightTheme } from '@/theme';

export default function DetailScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const theme = lightTheme;
  
  const today = new Date().toISOString().split('T')[0];
  const todaySession = state.sessions.find(s => s.date === today);
  
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [studyTip, setStudyTip] = useState<string>('Loading study tip...');
  const [reminderInterval, setReminderInterval] = useState<number | undefined>(
    todaySession?.reminderInterval
  );
  const [breakSuggestion, setBreakSuggestion] = useState(false);
  const [pedometerSteps, setPedometerSteps] = useState(0);

  useEffect(() => {
    // Load study tip
    fetchStudyTip().then((tip) => {
      setStudyTip(tip.text);
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev + 1;
          // Update session duration in minutes
          if (todaySession && newTimer % 60 === 0) {
            dispatch({
              type: 'UPDATE_DURATION',
              payload: { sessionId: todaySession.id, duration: Math.floor(newTimer / 60) },
            });
          }
          // Check for break suggestion
          const studyDurationMinutes = Math.floor(newTimer / 60);
          if (state.settings.pedometerEnabled) {
            const shouldBreak = suggestBreak(pedometerSteps, studyDurationMinutes);
            setBreakSuggestion(shouldBreak);
          } else {
            // Time-based break suggestion
            setBreakSuggestion(studyDurationMinutes > 60);
          }
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, todaySession, pedometerSteps, state.settings.pedometerEnabled, dispatch]);

  // Pedometer tracking
  useEffect(() => {
    if (state.settings.pedometerEnabled && isRunning) {
      const cleanup = startPedometerTracking((data) => {
        setPedometerSteps(data.steps);
      });
      return cleanup;
    }
  }, [state.settings.pedometerEnabled, isRunning]);

  const handleToggleTask = (taskId: string) => {
    if (todaySession) {
      dispatch({
        type: 'TOGGLE_TASK_COMPLETE',
        payload: { sessionId: todaySession.id, taskId },
      });
    }
  };

  const handleReminderChange = async (value: number | undefined) => {
    setReminderInterval(value);
    if (todaySession) {
      const updatedSession: Session = {
        ...todaySession,
        reminderInterval: value,
      };
      dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
      
      if (value) {
        const hasPermission = await requestPermissions();
        if (hasPermission) {
          await scheduleStudyReminder(value, todaySession.id);
        }
      }
    }
  };

  const status = todaySession ? getCompletionStatus(todaySession) : 'red';

  if (!todaySession) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style="auto" />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No session for today. Create one from the home screen!
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={[styles.dateText, { color: theme.colors.text }]}>
          {formatDate(todaySession.date)}
        </Text>
        <Badge status={status} theme={theme} />
      </View>

      <View style={[styles.timerSection, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.timerText, { color: theme.colors.text }]}>
          {formatTimer(timer)}
        </Text>
        {breakSuggestion && (
          <View style={[styles.breakSuggestion, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.breakSuggestionText}>
              💡 Time for a break! You've been studying for over an hour.
            </Text>
          </View>
        )}
        <View style={styles.timerControls}>
          <TouchableOpacity
            style={[styles.timerButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setIsRunning(!isRunning)}
          >
            <Text style={styles.timerButtonText}>
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timerButton, { backgroundColor: theme.colors.secondary }]}
            onPress={() => setTimer(0)}
          >
            <Text style={styles.timerButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tasks</Text>
        <FlatList
          data={todaySession.tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.taskItem, { backgroundColor: theme.colors.surface }]}>
              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => handleToggleTask(item.id)}
              >
                <Text style={[styles.checkbox, { color: theme.colors.primary }]}>
                  {item.completed ? '✓' : '○'}
                </Text>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskName, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.taskGoal, { color: theme.colors.textSecondary }]}>
                    Goal: {item.goal === 'full' ? '🟢 Full' : '🟡 Partial'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No tasks yet. Add one below!
            </Text>
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Study Tip
        </Text>
        <View style={[styles.tipContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.tipText, { color: theme.colors.text }]}>{studyTip}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Reminder Interval
        </Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.colors.surface }]}>
          <Picker
            selectedValue={reminderInterval}
            onValueChange={handleReminderChange}
            style={{ color: theme.colors.text }}
          >
            {REMINDER_INTERVALS.map((interval) => (
              <Picker.Item
                key={interval.value || 'none'}
                label={interval.label}
                value={interval.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/session/add')}
      >
        <Text style={styles.buttonText}>Add Today Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerSection: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  breakSuggestion: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  breakSuggestionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  timerControls: {
    flexDirection: 'row',
    // 'gap' not supported on RN; use spacing via child margins
  },
  timerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    fontSize: 24,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskGoal: {
    fontSize: 14,
  },
  tipContainer: {
    padding: 16,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});

