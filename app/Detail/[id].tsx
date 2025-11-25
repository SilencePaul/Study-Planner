import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { formatDate, formatTimer, getCompletionStatus } from '@/utils';
import { REMINDER_INTERVALS } from '@/constants';
import { fetchStudyTip } from '@/services/api';
import { updateStudyReminder, requestPermissions, cancelStudyReminders } from '@/services/notifications';
import { Badge } from '@/components/Badge';
import Button from '@/components/Button';
import { useTheme } from '@/theme/context';
import { createCommonStyles } from '@/theme/styles';
import { useLocalSearchParams } from 'expo-router';
import * as Notifications from 'expo-notifications'; 

export default function DetailScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { theme, isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const common = createCommonStyles(theme);
  const sessionId = Array.isArray(id) ? id[0] : id;
  const currentSession = sessionId ? state.sessions.find(s => s.id === sessionId) : undefined;

  // Use global timer state instead of local state
  const timer = currentSession ? state.activeTimers[currentSession.id] || 0 : 0;
  const [isRunning, setIsRunning] = useState(false);

  const [studyTip, setStudyTip] = useState<string>('Loading study tip...');
  const [reminderInterval, setReminderInterval] = useState<number | undefined>(
    currentSession?.reminderInterval
  );
  const [breakSuggestion, setBreakSuggestion] = useState(false);

  // LOCAL interval counter (in seconds) — hidden from UI
  const [localIntervalCounter, setLocalIntervalCounter] = useState<number>(0);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  useEffect(() => {
    const debugNotifications = async () => {
      console.log('🔍 DEBUGGING NOTIFICATION SOURCE');
      
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      
      if (scheduled.length > 0) {
        console.log('📋 FOUND SCHEDULED NOTIFICATIONS:');
        scheduled.forEach((notification, index) => {
          console.log(`Notification ${index + 1}:`, {
            identifier: notification.identifier,
            title: notification.content.title,
            body: notification.content.body,
            data: notification.content.data,
            trigger: JSON.stringify(notification.trigger)
          });
        });
      } else {
        console.log('✅ No scheduled notifications found');
      }
    };

    debugNotifications();
  }, []);

  const getLabelForValue = (value: number | undefined) => {
    const found = REMINDER_INTERVALS.find(i => i.value === value);
    return found ? found.label : 'None';
  };

  // the handleReminderChange function
  const handleReminderChange = async (interval: number | undefined) => {
    console.log('Selected interval:', interval);
    if (!currentSession) return;

    try {
      dispatch({
        type: 'UPDATE_REMINDER_INTERVAL',
        payload: {
          sessionId: currentSession.id,
          interval: interval
        }
      });

      setReminderInterval(interval);

      setLocalIntervalCounter(0);

      console.log('Reminder interval updated locally (counter reset, no auto-start if global timer not running).', interval);
    } catch (error) {
      console.error('❌ Error setting reminder:', error);
      alert('Error setting reminder: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleSelectInterval = async (value: number | undefined) => {
    await handleReminderChange(value);
    setDropdownVisible(false);
  };


  useEffect(() => {
    // Load study tip
    fetchStudyTip().then((tip) => {
      setStudyTip(tip.text);
    });
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning && currentSession) {
      interval = setInterval(() => {
        // increment global timer (one second)
        dispatch({
          type: 'INCREMENT_TIMER',
          payload: { sessionId: currentSession.id }
        });

        const currentTimer = timer || 0;
        if ((currentTimer + 1) % 60 === 0) {
          dispatch({
            type: 'UPDATE_DURATION',
            payload: {
              sessionId: currentSession.id,
              duration: Math.floor((currentTimer + 1) / 60)
            },
          });
        }

        const studyDurationMinutes = Math.floor((currentTimer + 1) / 60);
        setBreakSuggestion(studyDurationMinutes > 60);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // use timer (number) instead of whole state.activeTimers
  }, [isRunning, currentSession, dispatch, timer]);

    
    // Local interval notification effect
  useEffect(() => {
    // If no interval is set, do nothing
    if (!reminderInterval) {
      setLocalIntervalCounter(0);
      return;
    }

    let localTimer: NodeJS.Timeout | undefined;

    if (isRunning && currentSession) {
      localTimer = setInterval(async () => {
        setLocalIntervalCounter(prev => {
          const next = prev + 1;

          // When reaching the configured interval (in seconds), present a notification
          if (reminderInterval && next >= reminderInterval) {

            (async () => {
              try {
                // Double-check permission at the moment of showing the notification
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                  const { status } = await Notifications.requestPermissionsAsync();
                  finalStatus = status;
                }

                if (finalStatus === 'granted') {
                  // Build a readable label for seconds/minutes
                  const humanLabel = reminderInterval >= 60
                    ? `${Math.floor(reminderInterval / 60)} minute(s)`
                    : `${reminderInterval} second(s)`;

                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: '📚 Study Reminder',
                      body: `Time to study! You set reminders every ${humanLabel}.`,
                      data: {
                        sessionId: currentSession.id,
                        type: 'study-reminder-local',
                        intervalSeconds: reminderInterval
                      }
                    },
                    // Trigger immediately
                    trigger: { seconds: 1 } as Notifications.TimeIntervalTriggerInput
                  });
                } else {
                  console.log('Notifications permission denied — skipping local interval notification.');
                }
              } catch (err) {
                console.error('Error showing local interval notification:', err);
              }
            })();

            return 0;
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (localTimer) clearInterval(localTimer);
    };
    // we intentionally include reminderInterval and isRunning so it reacts to changes
  }, [isRunning, reminderInterval, currentSession]);

    // Reset timer function using global state
  const handleResetTimer = () => {
    if (currentSession) {
      dispatch({
        type: 'RESET_TIMER',
        payload: { sessionId: currentSession.id }
      });

      setLocalIntervalCounter(0);
      setIsRunning(true);
    }
  };


  // Task Toggle
  const handleToggleTask = (taskId: string) => {
    if (currentSession) {
      const task = currentSession.tasks.find(t => t.id === taskId);
      
      dispatch({
        type: 'TOGGLE_TASK_COMPLETE',
        payload: {
          sessionId: currentSession.id,
          taskId
        },
      });

    }
  };
  

  // Task Delete Handler
  const handleDeleteTask = (taskId: string) => {
    if (currentSession) {
      dispatch({
        type: 'DELETE_TASK',
        payload: {
          sessionId: currentSession.id,
          taskId
        },
      });
    }
  };

  const status = currentSession ? getCompletionStatus(currentSession) : 'red';

  if (!currentSession) {
    return (
      <View style={[common.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
          <View style={common.emptyContainer}>
            <Text style={[common.emptyText, { color: theme.colors.textSecondary }]}>No session for today. Create one from the home screen!</Text>
            <Button variant="primary" onPress={() => router.replace('/')} style={{ marginTop: 12 }} textStyle={{ color: '#fff' }}>Go to Home</Button>
          </View>
      </View>
    );
  }

  return (
    
      <View style={[common.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        {/* header section */}
        <View style={common.header}>
          <Text style={[common.dateText, { color: theme.colors.text }]}>
            {/* date */}
            {formatDate(currentSession.date)}
          </Text>
          {/* dot after date */}
          <Badge status={status} theme={theme} />
        </View>

        {/* timer section */}
        <View style={[styles.timerSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[common.timerText, { color: theme.colors.text }]}>
            {/* 00:00:00 */}
            {formatTimer(timer)}
          </Text>
          
          {/* Break Suggestion Banner */}
          {breakSuggestion && (
            <View style={[styles.breakSuggestion, { backgroundColor: theme.colors.warning }]}>
              <Text style={[styles.breakSuggestionText, { color: theme.colors.text }]}>
                💡 Time for a break! You've been studying for over an hour.
              </Text>
            </View>
          )}
          
          {/* Timer Controls */}
          <View style={styles.timerControls}>
            <TouchableOpacity 
              style={[styles.timerButton, { 
                backgroundColor: theme.colors.primary,
                width: 100, // Fixed width
              }]}
                onPress={() => {
                  const next = !isRunning;
                  setIsRunning(next);

                  // On Pause, reset local interval counter per spec
                  if (!next) {
                    setLocalIntervalCounter(0);
                  }
                }}

            >
              <Text style={styles.timerButtonText}>
                {isRunning ? 'Pause' : 'Start'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.timerButton, { 
                backgroundColor: theme.colors.secondary,
                width: 100, // Same fixed width
              }]}
              onPress={handleResetTimer} // Use the new function
            >
              <Text style={styles.timerButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <Text style={[common.sectionTitle, { color: theme.colors.text }]}>Tasks</Text>
          <View style={styles.tasksContainer}>
            <FlatList
              data={currentSession.tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
              const linkedAssignment = item.assignmentId ? 
                state.assignments.find(a => a.id === item.assignmentId) : null;

              return (
                <View style={[styles.taskItem, { 
                  backgroundColor: theme.colors.surface,
                  borderLeftWidth: 4,
                  borderLeftColor: item.completed ? theme.colors.success : 'transparent'
                }]}>
                  <View style={styles.taskMainContent}>
                    <TouchableOpacity 
                      style={styles.taskContent}
                      onPress={() => handleToggleTask(item.id)}
                    >
                      <Text style={[styles.checkbox, { 
                        color: item.completed ? theme.colors.success : theme.colors.primary 
                      }]}>
                        {item.completed ? '✓' : '○'}
                      </Text>
                      <View style={styles.taskInfo}>
                        <Text style={[
                          styles.taskName, 
                          { 
                            color: item.completed ? theme.colors.success : theme.colors.text,
                            textDecorationLine: item.completed ? 'line-through' : 'none'
                          }
                        ]}>
                          {item.name}
                          {linkedAssignment && item.completed && (
                            <Text style={{ color: theme.colors.success, fontSize: 12 }}>
                              {' (Finished)'}
                            </Text>
                          )}
                        </Text>
                        <Text style={[styles.taskGoal, { color: theme.colors.textSecondary }]}>
                          Goal: {item.goal === 'full' ? '🟢 Full' : '🟡 Partial'}
                        </Text>
                        {/* Assignment badge */}
                        {linkedAssignment && (
                          <View style={styles.assignmentBadge}>
                            <Text style={[styles.assignmentBadgeText, { 
                              color: theme.colors.primary,
                              backgroundColor: theme.colors.primary + '20'
                            }]}>
                              📝 Assignment
                            </Text>
                          </View>
                        )}
                        {/* Add description display - only show if description exists */}
                        {item.description && (
                          <Text 
                            style={[styles.taskDescription, { color: theme.colors.textSecondary }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.description}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Delete Button */}
                  <TouchableOpacity 
                    style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
                    onPress={() => handleDeleteTask(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
              ListEmptyComponent={
                <Text style={[common.emptyText, { color: theme.colors.textSecondary }]}>No tasks yet. Add one below!</Text>
              }
              showsVerticalScrollIndicator={true}
            />
          </View>
        </View>

        {/* Reminder Setting */}
        <View style={styles.section}>
          <Text style={[common.sectionTitle, { color: theme.colors.text }]}>Reminder Interval</Text>
          
          <View style={styles.dropdownContainer}>
            {/* Dropdown Trigger */}
            <TouchableOpacity
              style={[
                common.dropdownTrigger,
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={[
                common.dropdownTriggerText, 
                { color: theme.colors.text }
              ]}>
                {getLabelForValue(reminderInterval)}
              </Text>
              <Text style={[styles.dropdownArrow, { color: theme.colors.text }]}>
                {dropdownVisible ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {/* Dropdown List rendered in a Modal to avoid clipping by other lists */}
            <Modal
              visible={dropdownVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setDropdownVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
                <View style={styles.modalOverlay} />
              </TouchableWithoutFeedback>

              <View style={styles.modalContainer} pointerEvents="box-none">
                <View style={[
                  styles.modalCard,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                ]}>
                  <ScrollView style={styles.modalScroll} nestedScrollEnabled>
                    {(() => {
                      const quickOptions = REMINDER_INTERVALS.filter(i => typeof i.value === 'number' && i.value < 60);
                      const minuteOptions = REMINDER_INTERVALS.filter(i => (typeof i.value === 'number' && i.value >= 60) || i.value === undefined);

                      return (
                        <>
                          {quickOptions.length > 0 && (
                            <>
                              <Text style={[styles.dropdownSectionHeader, { color: theme.colors.textSecondary }]}>Quick Test</Text>
                              {quickOptions.map((interval) => (
                                <TouchableOpacity
                                  key={String(interval.value)}
                                  style={[
                                    styles.dropdownItem,
                                    reminderInterval === interval.value && styles.dropdownItemSelected,
                                  ]}
                                  onPress={() => { handleSelectInterval(interval.value); }}
                                >
                                  <Text style={[common.dropdownItemText, { color: theme.colors.text }]}>
                                    {interval.label}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </>
                          )}

                          {minuteOptions.length > 0 && (
                            <>
                              <Text style={[styles.dropdownSectionHeader, { color: theme.colors.textSecondary }]}>Minutes</Text>
                              {minuteOptions.map((interval) => (
                                <TouchableOpacity
                                  key={interval.value === undefined ? 'none' : String(interval.value)}
                                  style={[
                                    styles.dropdownItem,
                                    reminderInterval === interval.value && styles.dropdownItemSelected,
                                  ]}
                                  onPress={() => { handleSelectInterval(interval.value); }}
                                >
                                  <Text style={[common.dropdownItemText, { color: theme.colors.text }]}>
                                    {interval.label}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
        </View>

        {/* study tip section */}
        <View style={styles.section}>
          <Text style={[common.sectionTitle, { color: theme.colors.text }]}>Study Tip</Text>
          <View style={[common.tipContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[common.tipText, { color: theme.colors.text }]}>{studyTip}</Text>
          </View>
        </View>

        {/* ADD task button */}
        <Button
          variant="primary"
          onPress={() => router.push(`/session/add?sessionId=${currentSession.id}`)}
          style={{ marginTop: 12, alignSelf: 'stretch' }}
          textStyle={{ color: '#fff' }}
        >
          Add Today Task
        </Button>
      </View>
    
  );
}

const styles = StyleSheet.create({
  timerSection: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  breakSuggestion: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  breakSuggestionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  timerButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskMainContent: {
    flex: 1,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownContainer: {
    zIndex: 1000,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {},
  dropdownSectionHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000066',
  },
  modalContainer: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    bottom: 16,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  modalCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  modalScroll: {
    padding: 8,
  },
  tasksContainer: {
    height: 225,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  taskDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  assignmentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  assignmentBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

