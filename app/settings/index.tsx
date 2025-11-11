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
import { lightTheme } from '@/theme';
import { requestPermissions } from '@/services/notifications';

export default function SettingsScreen() {
  const { state, dispatch } = useAppContext();
  const theme = lightTheme;

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

  const handlePedometerToggle = (value: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { pedometerEnabled: value },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
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
                state.settings.theme === 'light' && styles.themeOptionSelected,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[styles.themeOptionText, { color: theme.colors.text }]}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                state.settings.theme === 'dark' && styles.themeOptionSelected,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[styles.themeOptionText, { color: theme.colors.text }]}>
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                state.settings.theme === 'auto' && styles.themeOptionSelected,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => handleThemeChange('auto')}
            >
              <Text style={[styles.themeOptionText, { color: theme.colors.text }]}>
                Auto
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Sensors
          </Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Pedometer (Break Suggestions)
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Get reminders to take breaks after long study sessions
              </Text>
            </View>
            <Switch
              value={state.settings.pedometerEnabled}
              onValueChange={handlePedometerToggle}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
            />
          </View>
        </View>
      </View>
    </View>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    // spacing handled with margins on children
  },
  themeOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  themeOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

