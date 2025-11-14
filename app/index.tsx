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
        style={[styles.sessionItem, { backgroundColor: theme.colors.surface }]}
        onPress={() => router.push(`/Detail/${item.id}`)}
      >
        {/* Main content */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.dateText, { color: theme.colors.text }]}>
            {formatDate(item.date)}
          </Text>
          {/* timer */} 
          <Text style={[styles.durationText, { color: theme.colors.text }]}>
            {formatTimer(sessionTimer)}  -  {item.tasks.length} tasks
          </Text>
        </View>
        
        {/* Badge / dot positioned absolutely */}
        <View style={styles.badgeWrapper}>
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/*empty panel list*/}
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

      {/*create new study record button*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
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
          <Text style={styles.buttonText}>Create New Study Record</Text>
        </TouchableOpacity>

        {/**/}
        {/*manage assignment button*/}
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => router.push('/assignments')}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Manage Assignments</Text>
        </TouchableOpacity>
        
        {/*settings button*/}
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
    padding: 12,
  },
  sessionItem: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 130,
    // 保证子元素绝对定位仍然可见
    overflow: 'visible',        // <-- 允许子元素超出可见区域
    position: 'relative',       // <-- 为绝对定位的子元素提供参考定位上下文
    //backgroundColor: '#fff',
  },
  sessionHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: { // for date one top of each study panel.
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  durationText: { // 
    fontSize: 35, 
    fontWeight: '500',
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
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 10,
    // spacing via margins on children
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  primaryButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  badgeWrapper: { // for badge(dot)
  position: 'absolute', // float in corner
  top: 12,
  right: 12,
  zIndex: 10,           // make sure it renders above other content
},
});
