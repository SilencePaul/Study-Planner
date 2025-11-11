import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from './context';
import { Session } from '@/types';
import { formatDate, formatTime, getCompletionStatus } from '@/utils';
import { Badge } from '@/components/Badge';
import { lightTheme } from '@/theme';

export const options = {
  title: 'Home',
  headerShown: true,
};

export default function HomeScreen() {
  console.log('HomeScreen component is rendering!');
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const theme = lightTheme; // TODO: Implement theme switching
  
  console.log('HomeScreen - State loaded:', { sessionsCount: state.sessions.length });

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'DELETE_SESSION', payload: sessionId });
          },
        },
      ]
    );
  };

  const renderSessionItem = ({ item }: { item: Session }) => {
    const status = getCompletionStatus(item);
    
    return (
      <TouchableOpacity
        style={[styles.sessionItem, { backgroundColor: theme.colors.surface }]}
        onPress={() => router.push(`/Detail/${item.id}`)}
      >
        <View style={styles.sessionHeader}>
          <View>
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {formatDate(item.date)}
            </Text>
            <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}> 
              {formatTime(item.duration)}    {item.tasks.length} tasks
            </Text>
          </View>
          <Badge status={status} theme={theme} />
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteSession(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      <FlatList
        data={state.sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSessionItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}> 
              No study sessions yet. Create your first one!
            </Text>
          </View>
        }
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            const today = new Date().toISOString().split('T')[0];
            const newSession: Session = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              date: today,
              duration: 0,
              tasks: [],
            };
            dispatch({ type: 'ADD_SESSION', payload: newSession });
            router.push(`/Detail/${newSession.id}`);
          }}
        >
          <Text style={styles.buttonText}>Create New Study Record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => router.push('/assignments')}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Manage Assignments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  sessionItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    // spacing via margins on children
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  primaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
