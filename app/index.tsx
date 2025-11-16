import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router'; // Navigation hook
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from './context'; // Global state management
import { Session } from '@/types';
import { formatDate, formatTime, formatTimer, getCompletionStatus } from '@/utils';// Helper functions
import { Badge } from '@/components/Badge';
import { useTheme } from '@/theme/context';
import { createCommonStyles } from '@/theme/styles';


//Main screen that displays study sessions and 
// provides navigation to other features.

export const options = {
  title: 'Study Sessions',
  headerShown: true,// Shows native header with back button
};

export default function HomeScreen() {
  console.log('HomeScreen component is rendering!');// Debug logging
  const router = useRouter();// Navigation instance
  const { state, dispatch } = useAppContext();//global app state && update
  const { theme, isDark } = useTheme();
  const common = createCommonStyles(theme);
  console.log('HomeScreen - State loaded:', { sessionsCount: state.sessions.length });

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            dispatch({ type: 'DELETE_SESSION', payload: sessionId });
          },
        },
      ]
    );
  };

  {/* Takes panel */}
  const renderSessionItem = ({ item }: { item: Session }) => { // Takes an object with item property of type Session
    const status = getCompletionStatus(item); // currnet status
    // Get timer from global state
    const sessionTimer = (state.activeTimers && state.activeTimers[item.id]) || 0;

    return (
      // one task panel
      <TouchableOpacity // style of card
        style={[common.sessionItem, { backgroundColor: theme.colors.surface }]}
        onPress={() => router.push(`/Detail/${item.id}`)}
      >
        {/* Main content */}
        <View style={{ flex: 1 }}>
          <Text style={[common.dateText, { color: theme.colors.text }]}>
            {formatDate(item.date)}
          </Text>
          {/* timer */} 
          <Text style={[common.durationText, { color: theme.colors.text }]}>
            {formatTimer(sessionTimer)}  -  {item.tasks.length} tasks
          </Text>
        </View>
        
        {/* Badge / dot positioned absolutely */}
        <View style={common.badgeWrapper}>
          <Badge status={status} theme={theme} />
        </View>

        {/* Delete button stays at bottom */}
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
    <View style={[common.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/*empty panel list*/}
      <FlatList
        data={state.sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSessionItem}
        contentContainerStyle={common.listContent}
        ListEmptyComponent={
          <View style={common.emptyContainer}>
            <Text style={[common.emptyText, { color: theme.colors.textSecondary }]}> 
              No study sessions yet. Create your first one!
            </Text>
          </View>
        }
      />

      {/*create new study record button*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[common.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // Home screen: create session with full ISO datetime
            const now = new Date();
            const todayIso = now.toISOString();

            const newSession: Session = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              date: todayIso,
              duration: 0,
              tasks: [],
            };
            dispatch({ type: 'ADD_SESSION', payload: newSession });
            router.push(`/Detail/${newSession.id}?isNew=true`);
          }}
        >
          <Text style={common.buttonText}>Create New Study Record</Text>
        </TouchableOpacity>

        {/**/}
        {/*manage assignment button*/}
        <TouchableOpacity
          style={[common.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => router.push('/assignments')}
        >
          <Text style={[common.secondaryButtonText, { color: theme.colors.primary }]}>Manage Assignments</Text>
        </TouchableOpacity>
        
        {/*settings button*/}
        <TouchableOpacity
          style={[common.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={[common.secondaryButtonText, { color: theme.colors.primary }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    padding: 3,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 10,
    // spacing via margins on children
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
