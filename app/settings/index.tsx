// SettingsScreen.tsx 
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { useTheme } from '@/theme/context'; // Import useTheme hook
import { createCommonStyles } from '@/theme/styles';
import { requestPermissions } from '@/services/notifications';

export default function SettingsScreen() {
  const { state, dispatch } = useAppContext();
  const { theme, isDark } = useTheme(); // Get dynamic theme from context
  const common = createCommonStyles(theme);

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return; // Don't update if permission denied
      }
    }
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { notificationsEnabled: value },
    });
  };

  const handleThemeChange = (themeValue: 'light' | 'dark' | 'auto') => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { theme: themeValue },
    });
  };

  return (
    <View style={[common.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[common.sectionTitle, { color: theme.colors.text }] }>
            Notifications
          </Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              Study Reminders
            </Text>
            <Switch
              value={state.settings.notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={state.settings.notificationsEnabled ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Text>
          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                state.settings.theme === 'light' && [
                  styles.themeOptionSelected,
                  { backgroundColor: theme.colors.primary + '20' }
                ],
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[
                styles.themeOptionText, 
                { 
                  color: theme.colors.text,
                  fontWeight: state.settings.theme === 'light' ? 'bold' : 'normal'
                }
              ]}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                state.settings.theme === 'dark' && [
                  styles.themeOptionSelected,
                  { backgroundColor: theme.colors.primary + '20' }
                ],
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[
                styles.themeOptionText, 
                { 
                  color: theme.colors.text,
                  fontWeight: state.settings.theme === 'dark' ? 'bold' : 'normal'
                }
              ]}>
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                state.settings.theme === 'auto' && [
                  styles.themeOptionSelected,
                  { backgroundColor: theme.colors.primary + '20' }
                ],
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => handleThemeChange('auto')}
            >
              <Text style={[
                styles.themeOptionText, 
                { 
                  color: theme.colors.text,
                  fontWeight: state.settings.theme === 'auto' ? 'bold' : 'normal'
                }
              ]}>
                Auto
              </Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 32,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8, // Better spacing
  },
  themeOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  themeOptionSelected: {
    // Background color is now set dynamically
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingTextContainer: {
    flex: 1, // Take up all available space
    marginRight: 16, // Space between text and switch
  },
  switchContainer: {
    marginTop: 6, // Align switch better with text
  },
});