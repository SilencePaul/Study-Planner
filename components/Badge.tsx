import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, AccessibilityInfo } from 'react-native';
import { CompletionStatus } from '@/types';
import { useAppContext } from '@/app/context';
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

  // animation refs
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showMedal, setShowMedal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const PARTICLE_COUNT = 10;
  // prepare particle animated values
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rot: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;
  const prevStatus = useRef<CompletionStatus | null>(null);

  useEffect(() => {
    // trigger pop animation when status transitions to gold or silver
    if (prevStatus.current !== status && (status === 'gold' || status === 'silver')) {
      // show overlay medal
      setShowMedal(true);
      // show JS confetti (pure Animated) for Expo Go compatibility
      setShowConfetti(true);
      // Accessibility announcement
      const announce = `${status === 'gold' ? 'Gold' : 'Silver'} badge unlocked.`;
      AccessibilityInfo.announceForAccessibility(announce);
      scale.setValue(0);
      opacity.setValue(1);

      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.4,
          duration: 300,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(700),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowMedal(false);
        // run particle animations
        const animations = particles.map((p) => {
          // randomize targets
          const toX = (Math.random() - 0.5) * 120; // -60..60
          const toY = - (80 + Math.random() * 120); // -80..-200
          const toRot = Math.random() * 360;

          // reset values
          p.x.setValue(0);
          p.y.setValue(0);
          p.rot.setValue(0);
          p.opacity.setValue(1);

          return Animated.parallel([
            Animated.timing(p.x, {
              toValue: toX,
              duration: 900 + Math.random() * 400,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(p.y, {
              toValue: toY,
              duration: 900 + Math.random() * 400,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(p.rot, {
              toValue: toRot,
              duration: 900 + Math.random() * 400,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 900 + Math.random() * 400,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]);
        });

        Animated.stagger(30, animations).start(() => {
          setShowConfetti(false);
        });
      });
    }

    prevStatus.current = status;
  }, [status, scale, opacity]);

  return (
    <View style={styles.container}>
      {/* Animated medal overlay */}
      {showMedal && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.medalOverlay,
            { transform: [{ scale }], opacity },
          ]}
        >
          <Text style={styles.medalEmoji}>{status === 'gold' ? '🥇' : '🥈'}</Text>
        </Animated.View>
      )}

      {/* JS confetti particles (emoji) - works in Expo Go */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          {particles.map((p, i) => {
            const rotate = p.rot.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
            return (
              <Animated.Text
                key={i}
                style={[
                  styles.particle,
                  {
                    transform: [
                      { translateX: p.x },
                      { translateY: p.y },
                      { rotate },
                    ],
                    opacity: p.opacity,
                  },
                ]}
              >
                🎉
              </Animated.Text>
            );
          })}
        </View>
      )}

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
  medalOverlay: {
    position: 'absolute',
    top: -28,
    left: -8,
    right: -8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  medalEmoji: {
    fontSize: 48,
    textShadowColor: '#00000088',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  confetti: {
    position: 'absolute',
    top: -40,
    left: -40,
    right: -40,
    height: 120,
    zIndex: 30,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  levelChip: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  confettiContainer: {
    position: 'absolute',
    top: -12,
    left: -8,
    right: -8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    height: 80,
  },
  particle: {
    position: 'absolute',
    fontSize: 18,
    includeFontPadding: false,
  },
});

