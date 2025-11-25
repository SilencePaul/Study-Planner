import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { Assignment } from '@/types';
import { generateId } from '@/utils';
import { lightTheme } from '@/theme';
import { useTheme } from '@/theme/context';
import { createCommonStyles } from '@/theme/styles';
import Button from '@/components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewAssignmentScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { theme } = useTheme();
  const common = createCommonStyles(theme);

  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an assignment name');
      return;
    }

    const newAssignment: Assignment = {
      id: generateId(),
      name: name.trim(),
      dueDate: dueDate.toISOString().split('T')[0],
      progress: 0,
    };

    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
    router.back();
  };

  return (
    <View style={[common.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Assignment Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter assignment name"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Due Date</Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

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
            ❌ Cancel
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
  },
  actionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
});

