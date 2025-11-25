// SettingsScreen.tsx 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { useTheme } from '@/theme/context'; // Import useTheme hook
import { createCommonStyles } from '@/theme/styles';
import Button from '@/components/Button';
import { requestPermissions } from '@/services/notifications';

export default function SettingsScreen() {
  const { state, dispatch } = useAppContext();
  const { theme, isDark } = useTheme(); // Get dynamic theme from context
  const common = createCommonStyles(theme);

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
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
          <Text style={[common.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Text>
          <View style={styles.themeOptions}>
            <Button
              variant="secondary"
              onPress={() => handleThemeChange('light')}
              style={[styles.themeOption, { borderColor: theme.colors.primary, marginHorizontal: 4, flex: 1 }, state.settings.theme === 'light' && { backgroundColor: theme.colors.primary + '20' }]}
              textStyle={[styles.themeOptionText, { color: theme.colors.text, fontWeight: state.settings.theme === 'light' ? 'bold' : 'normal' }]}
            >
              Light
            </Button>

            <Button
              variant="secondary"
              onPress={() => handleThemeChange('dark')}
              style={[styles.themeOption, { borderColor: theme.colors.primary, marginHorizontal: 4, flex: 1 }, state.settings.theme === 'dark' && { backgroundColor: theme.colors.primary + '20' }]}
              textStyle={[styles.themeOptionText, { color: theme.colors.text, fontWeight: state.settings.theme === 'dark' ? 'bold' : 'normal' }]}
            >
              Dark
            </Button>

            <Button
              variant="secondary"
              onPress={() => handleThemeChange('auto')}
              style={[styles.themeOption, { borderColor: theme.colors.primary, marginHorizontal: 4, flex: 1 }, state.settings.theme === 'auto' && { backgroundColor: theme.colors.primary + '20' }]}
              textStyle={[styles.themeOptionText, { color: theme.colors.text, fontWeight: state.settings.theme === 'auto' ? 'bold' : 'normal' }]}
            >
              Auto
            </Button>
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