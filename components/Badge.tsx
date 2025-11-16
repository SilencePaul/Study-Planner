import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CompletionStatus } from '@/types';
import { Theme } from '@/theme';

interface BadgeProps {
  status: CompletionStatus;
  theme: Theme;
}

export const Badge: React.FC<BadgeProps> = ({ status, theme }) => {
  const getBadgeContent = () => {
    switch (status) {
      case 'gold':
        return { emoji: '🥇', label: 'Gold' };
      case 'silver':
        return { emoji: '🥈', label: 'Silver' };
      case 'red':
        return { emoji: '🔴', label: 'Incomplete' };
    }
  };

  const { emoji, label } = getBadgeContent();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 16,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

