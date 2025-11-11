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
import { lightTheme } from '@/theme';

export default function AddSessionScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const theme = lightTheme;

  const [taskName, setTaskName] = useState('');
  const [goal, setGoal] = useState<'full' | 'partial'>('full');
  const [description, setDescription] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | undefined>();

  const today = new Date().toISOString().split('T')[0];
  let todaySession = state.sessions.find(s => s.date === today);

  const handleSave = () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    // Create today's session if it doesn't exist
    if (!todaySession) {
      todaySession = {
        id: generateId(),
        date: today,
        duration: 0,
        tasks: [],
      };
      dispatch({ type: 'ADD_SESSION', payload: todaySession });
    }

    const newTask: Task = {
      id: generateId(),
      name: taskName.trim(),
      goal,
      completed: false,
      description: description.trim() || undefined,
      assignmentId: selectedAssignmentId,
    };

    dispatch({
      type: 'ADD_TASK',
      payload: { sessionId: todaySession.id, task: newTask },
    });

    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Task Source</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioOption,
                !selectedAssignmentId && styles.radioSelected,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedAssignmentId(undefined)}
            >
              <Text style={[styles.radioText, { color: theme.colors.text }]}>
                Custom Task
              </Text>
            </TouchableOpacity>
            {state.assignments.length > 0 && (
              <View style={styles.assignmentList}>
                {state.assignments.map((assignment) => (
                  <TouchableOpacity
                    key={assignment.id}
                    style={[
                      styles.radioOption,
                      selectedAssignmentId === assignment.id && styles.radioSelected,
                      { borderColor: theme.colors.primary },
                    ]}
                    onPress={() => setSelectedAssignmentId(assignment.id)}
                  >
                    <Text style={[styles.radioText, { color: theme.colors.text }]}>
                      {assignment.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

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

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Completion Goal
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.goalOption,
                goal === 'full' && styles.goalSelected,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => setGoal('full')}
            >
              <Text style={styles.goalEmoji}>🟢</Text>
              <Text style={[styles.goalText, { color: theme.colors.text }]}>Full</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.goalOption,
                goal === 'partial' && styles.goalSelected,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => setGoal('partial')}
            >
              <Text style={styles.goalEmoji}>🟡</Text>
              <Text style={[styles.goalText, { color: theme.colors.text }]}>Partial</Text>
            </TouchableOpacity>
          </View>
        </View>

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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>✅ Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.colors.error }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.cancelButtonText, { color: theme.colors.error }]}>
              ❌ Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
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
    backgroundColor: '#E3F2FD',
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
    backgroundColor: '#E3F2FD',
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    // replace gap with margins on buttons
    marginTop: 8,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

