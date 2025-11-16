import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { Assignment } from '@/types';
import { formatDate, getDaysUntilDue, sortByDueDate } from '@/utils';
import { ProgressBar } from '@/components/ProgressBar';
import { useTheme } from '@/theme/context';
import { createCommonStyles } from '@/theme/styles';

export default function ManageAssignmentsScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { theme } = useTheme();
  const common = createCommonStyles(theme);

  const sortedAssignments = sortByDueDate(state.assignments);

  const handleDelete = (assignmentId: string) => {
    dispatch({ type: 'DELETE_ASSIGNMENT', payload: assignmentId });
  };

  const renderAssignmentItem = ({ item }: { item: Assignment }) => {
    const daysUntilDue = getDaysUntilDue(item.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    const isCompleted = item.progress === 100;

    return (
      <View style={[
        styles.assignmentItem, 
        { 
          backgroundColor: theme.colors.surface,
          borderLeftWidth: 4,
          borderLeftColor: isCompleted ? theme.colors.success : 'transparent'
        }
      ]}>
        <View style={styles.assignmentHeader}>
          <View style={styles.assignmentInfo}>
            <Text style={[
              styles.assignmentName, 
              { 
                color: isCompleted ? theme.colors.success : theme.colors.text,
                textDecorationLine: isCompleted ? 'line-through' : 'none'
              }
            ]}>
              {item.name}
              {isCompleted && (
                <Text style={{ color: theme.colors.success, fontSize: 12 }}>
                  {' (Finished)'}
                </Text>
              )}
            </Text>
            <Text
              style={[
                styles.dueDate,
                {
                  color: isCompleted 
                    ? theme.colors.success 
                    : isOverdue
                    ? theme.colors.error
                    : isDueSoon
                    ? theme.colors.warning
                    : theme.colors.textSecondary,
                },
              ]}
            >
              Due: {formatDate(item.dueDate)}
              {isOverdue && !isCompleted && ' (Overdue)'}
              {isDueSoon && !isOverdue && !isCompleted && ` (${daysUntilDue} days left)`}
              {isCompleted && ' (Completed)'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <Text style={[styles.deleteText, { color: theme.colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressContainer}>
          <Text style={[
            styles.progressLabel, 
            { 
              color: isCompleted ? theme.colors.success : theme.colors.textSecondary 
            }
          ]}>
            Progress: {item.progress}%
            {isCompleted && ' 🎉'}
          </Text>
          <ProgressBar progress={item.progress} theme={theme} animated />
        </View>
      </View>
    );
  };

  return (
    <View style={[common.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      <FlatList
        data={sortedAssignments}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignmentItem}
        contentContainerStyle={common.listContent}
        ListEmptyComponent={
          <View style={common.emptyContainer}>
            <Text style={[common.emptyText, { color: theme.colors.textSecondary }]}>No assignments yet. Add your first assignment!</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[common.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/assignments/new')}
      >
        <Text style={common.buttonText}>Add New Assignment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  assignmentItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  assignmentName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
});

