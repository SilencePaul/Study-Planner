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
  const selectedAssignment = state.assignments.find(a => a.id === selectedAssignmentId);

  // taskName: Stores the task name input
  const [taskName, setTaskName] = useState('');
  // goal: Tracks completion goal (full/partial)
  const [goal, setGoal] = useState<'full' | 'partial'>('full');
  // description: Stores optional task description
  const [description, setDescription] = useState('');
  // selectedAssignmentId: Tracks if task comes from an assignment
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | undefined>();

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
    
    // Don't show if already added to current session
    const isAlreadyAdded = currentSession.tasks.some(task => 
      task.assignmentId === assignmentId
    );
    
    return !isAlreadyAdded;
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
          <TouchableOpacity
            style={[common.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSave}
          >
            <Text style={common.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[common.secondaryButton, { borderColor: theme.colors.error }]}
            onPress={() => router.back()}
          >
            <Text style={[common.secondaryButtonText, { color: theme.colors.error }]}>Cancel</Text>
          </TouchableOpacity>
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

