import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { Task } from '@/types';
import { generateId } from '@/utils';
import { useTheme } from '@/theme/context';
import { createCommonStyles } from '@/theme/styles';
import Button from '@/components/Button';
import { useLocalSearchParams } from 'expo-router';


// Add tesk Screen

// Initialize component state and context
export default function AddSessionScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { theme, isDark } = useTheme();
  const common = createCommonStyles(theme);

  // for dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // taskName: Stores the task name input
  const [taskName, setTaskName] = useState('');
  // goal: Tracks completion goal (full/partial)
  const [goal, setGoal] = useState<'full' | 'partial'>('full');
  // partialPercent: contribution percent for partial goal tasks
  const [partialPercent, setPartialPercent] = useState<number>(50);
  // description: Stores optional task description
  const [description, setDescription] = useState('');
  // selectedAssignmentId: Tracks if task comes from an assignment
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | undefined>();

  const selectedAssignment = state.assignments.find(a => a.id === selectedAssignmentId);

  // Counts for selected assignment partials
  const partialTasksForAssignment = selectedAssignmentId
    ? state.sessions.flatMap(s => s.tasks).filter(t => t.assignmentId === selectedAssignmentId && t.goal === 'partial')
    : [];
  const partialCount = partialTasksForAssignment.length;
  const completedPartialCount = partialTasksForAssignment.filter(t => t.completed).length;

  // Purpose: Determine which session to add the task to
  const today = new Date().toLocaleDateString('en-CA');
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  let currentSession = sessionId
  ? state.sessions.find(s => s.id === sessionId)
  : state.sessions.find(s => s.date === today);

  // Check if assignment is already added to current session OR is completed
  const isAssignmentAvailable = (assignmentId: string): boolean => {
    if (!currentSession) return false;
    
    const assignment = state.assignments.find(a => a.id === assignmentId);
    
    // Don't show if assignment is fully completed (100% progress)
    if (assignment?.progress === 100) {
      return false;
    }
    
    // Allow adding the same assignment multiple times as long as it's not completed.
    return true;
  };

  // Filter assignments to exclude already added ones AND completed ones
  const availableAssignments = state.assignments.filter(assignment => 
    isAssignmentAvailable(assignment.id)
  );

    // Purpose: Validate and save the new task
    const handleSave = () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }
    
    // ADD THIS VALIDATION:
    if (selectedAssignmentId && currentSession && !isAssignmentAvailable(selectedAssignmentId)) {
      Alert.alert(
        'Assignment Already Added',
        `This assignment is already in today's session. Please select a different assignment or use a custom task.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // If this is a partial task linked to an assignment, ensure partialPercent doesn't exceed remaining
    if (selectedAssignmentId && goal === 'partial') {
      const assignment = state.assignments.find(a => a.id === selectedAssignmentId);
      const remaining = Math.max(0, 100 - (assignment?.progress || 0));
      if (partialPercent > remaining) {
        // Offer choices to the user: auto-adjust, mark full, or cancel
        Alert.alert(
          'Partial percent too large',
          `The entered partial percent (${partialPercent}%) exceeds the remaining ${remaining}% for this assignment. What would you like to do?`,
          [
            {
              text: `Auto-adjust to ${remaining}%`,
              onPress: () => {
                // adjust and continue save
                const adjustedTask: Task = {
                  id: generateId(),
                  name: taskName.trim(),
                  goal,
                  completed: false,
                  description: description.trim() || undefined,
                  assignmentId: selectedAssignmentId,
                  partialPercent: remaining,
                };

                dispatch({ // Dispatches ADD_TASK action to global state
                  type: 'ADD_TASK',
                  payload: { sessionId: currentSession!.id, task: adjustedTask },
                });
                router.back();
              },
            },
            {
              text: 'Mark as Full',
              onPress: () => {
                const fullTask: Task = {
                  id: generateId(),
                  name: taskName.trim(),
                  goal: 'full',
                  completed: false,
                  description: description.trim() || undefined,
                  assignmentId: selectedAssignmentId,
                };
                dispatch({ type: 'ADD_TASK', payload: { sessionId: currentSession!.id, task: fullTask } });
                router.back();
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
        return;
      }
    }
  
    // Create today's session if it doesn't exist
    if (!currentSession) {
      currentSession = {
        id: generateId(),
        date: today,
        duration: 0,
        tasks: [],
      };
      dispatch({ type: 'ADD_SESSION', payload: currentSession });
    }

    const newTask: Task = { // Creates task object with all form data
      id: generateId(),
      name: taskName.trim(),
      goal,
      completed: false,
      description: description.trim() || undefined,
      assignmentId: selectedAssignmentId,
      partialPercent: goal === 'partial' ? partialPercent : undefined,
    };
    dispatch({ // Dispatches ADD_TASK action to global state
      type: 'ADD_TASK',
      payload: { sessionId: currentSession.id, task: newTask },
    });
    router.back();
  };

  // UI
  return (
    <ScrollView
      style={[common.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/*  */}
      {/* custom task or pre-existing assignment */}
      <View style={styles.content}>
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Task Source</Text>
        
        {/* Custom Task Option */}
        <TouchableOpacity
          style={[
            styles.radioOption,
            { 
              borderColor: theme.colors.primary,
              backgroundColor: !selectedAssignmentId ? theme.colors.primary + '20' : theme.colors.surface
            },
          ]}
          onPress={() => {
            setSelectedAssignmentId(undefined);
            setDropdownVisible(false);
          }}
        >
          <Text style={[styles.radioText, { color: theme.colors.text }]}>
            Custom Task
          </Text>
        </TouchableOpacity>

      {/* Assignment Dropdown */}
      {availableAssignments.length > 0 && (
        <View style={styles.dropdownContainer}>
          <Text style={[styles.dropdownLabel, { color: theme.colors.text }]}>
            Select from Assignment List
          </Text>
          
          {/* Dropdown Trigger */}
          <TouchableOpacity
            style={[
              common.dropdownTrigger,
              { 
                backgroundColor: selectedAssignmentId ? theme.colors.primary + '20' : theme.colors.surface,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={[
              common.dropdownTriggerText, 
              { color: selectedAssignmentId ? theme.colors.text : theme.colors.textSecondary }
            ]}>
              {selectedAssignmentId 
                ? state.assignments.find(a => a.id === selectedAssignmentId)?.name 
                : "Choose an assignment..."}
            </Text>
            <Text style={[styles.dropdownArrow, { color: theme.colors.text }]}>
              {dropdownVisible ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {/* Dropdown List */}
          {dropdownVisible && (
            <View style={[
              common.dropdownList,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
              <ScrollView 
                style={styles.dropdownScrollView}
                nestedScrollEnabled={true}
              >
                {availableAssignments.map((assignment) => (
                  <TouchableOpacity
                    key={assignment.id}
                    style={[
                      styles.dropdownItem,
                      selectedAssignmentId === assignment.id && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedAssignmentId(assignment.id);
                      setDropdownVisible(false);
                      setTaskName(assignment.name);
                    }}
                  >
                    <Text style={[common.dropdownItemText, { color: theme.colors.text }]}>
                      {assignment.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
        
      </View>
        
        {/* Purpose: the task name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Task Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={taskName}
            onChangeText={setTaskName}
            placeholder="Enter task name"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        {/* Partial percent input when user selects partial goal */}
        {goal === 'partial' && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Partial Contribution (%)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={String(partialPercent)}
              onChangeText={(t) => {
                const n = Number(t.replace(/[^0-9]/g, '')) || 0;
                // clamp between 1 and 100
                const clamped = Math.max(1, Math.min(100, n));
                setPartialPercent(clamped);
              }}
              keyboardType="numeric"
              placeholder="Enter percent (1-100)"
              placeholderTextColor={theme.colors.textSecondary}
            />

            {selectedAssignmentId && (
              (() => {
                const assignment = state.assignments.find(a => a.id === selectedAssignmentId);
                const remaining = Math.max(0, 100 - (assignment?.progress || 0));
                return (
                  <>
                    <Text style={{ marginTop: 6, color: partialPercent > remaining ? theme.colors.error : theme.colors.textSecondary }}>
                      {`Remaining for assignment: ${remaining}%`}
                      {partialPercent > remaining ? ' — Entered percent exceeds remaining; choose a smaller percentage or mark task as Full.' : ''}
                    </Text>

                    <Text style={{ marginTop: 6, color: theme.colors.textSecondary }}>
                      {`Partials added: ${partialCount} (${completedPartialCount} completed)`}
                    </Text>

                    {partialPercent > remaining && (
                      <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <Button
                          variant="secondary"
                          onPress={() => setPartialPercent(remaining)}
                          style={{ flex: 1, marginRight: 8 }}
                          textStyle={{ color: theme.colors.text }}
                        >
                          Auto-adjust to {remaining}%
                        </Button>

                        <Button
                          variant="secondary"
                          onPress={() => setGoal('full')}
                          style={{ flex: 1 }}
                          textStyle={{ color: theme.colors.text }}
                        >
                          Make Full
                        </Button>
                      </View>
                    )}
                  </>
                );
              })()
            )}
          </View>
        )}
        {/* Goal Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Completion Goal
          </Text>
          <View style={styles.radioGroup}>
            {/* Full Goal Option */}
            <TouchableOpacity
              style={[
                styles.goalOption,
                { 
                  borderColor: theme.colors.primary,
                  backgroundColor: goal === 'full' ? theme.colors.primary + '20' : theme.colors.surface
                },
              ]}
              onPress={() => setGoal('full')}
            >
              <Text style={styles.goalEmoji}>🟢</Text>
              <Text style={[styles.goalText, { color: theme.colors.text }]}>Full</Text>
            </TouchableOpacity>

            {/* Partial Goal Option */}
            <TouchableOpacity
              style={[
                styles.goalOption,
                { 
                  borderColor: theme.colors.primary,
                  backgroundColor: goal === 'partial' ? theme.colors.primary + '20' : theme.colors.surface
                },
              ]}
              onPress={() => setGoal('partial')}
            >
              <Text style={styles.goalEmoji}>🟡</Text>
              <Text style={[styles.goalText, { color: theme.colors.text }]}>Partial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Description (Optional)
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add notes or description"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>
            
        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            variant="primary"
            onPress={handleSave}
            style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.primary }}
            textStyle={{ color: '#fff' }}
          >
            Save
          </Button>

          <Button
            variant="secondary"
            onPress={() => router.back()}
            style={{ flex: 1, borderColor: theme.colors.error }}
            textStyle={{ color: theme.colors.error }}
          >
            Cancel
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    position: 'relative',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    // use margin on children instead of gap
  },
  radioOption: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  radioSelected: {
  },
  radioText: {
    fontSize: 16,
  },
  assignmentList: {
    marginTop: 8,
    // use margin on children instead of gap
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    // child spacing handled via margin
  },
  goalSelected: {
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // action buttons use shared common styles
  // for dropdown
  dropdownContainer: {
  marginTop: 12,
  zIndex: 1, // Ensure dropdown appears above other content
},
dropdownLabel: {
  fontSize: 14,
  fontWeight: '500',
  marginBottom: 8,
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
},
dropdownItemSelected: {
},
  
  actionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
});

