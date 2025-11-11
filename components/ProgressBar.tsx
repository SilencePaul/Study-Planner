import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Theme } from '@/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  theme: Theme;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  theme,
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress);
    }
  }, [progress, animated, animatedValue]);

  const width = animated
    ? animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      })
    : `${progress}%`;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.border }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: (animated ? width : (`${progress}%` as unknown)) as
              | Animated.AnimatedInterpolation<string | number>
              | `${number}%`,
            backgroundColor: theme.colors.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
});

