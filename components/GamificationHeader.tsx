import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppContext } from '@/app/context';
import { useTheme } from '@/theme/context';

const XP_PER_LEVEL = 500;

export default function GamificationHeader() {
  const { state } = useAppContext();
  const { theme } = useTheme();
  const xp = state.xp ?? 0;
  const level = state.level ?? Math.floor(xp / XP_PER_LEVEL);

  // Toast animation for XP gain
  const [toastText, setToastText] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const prevXp = useRef<number>(xp);

  useEffect(() => {
    if (xp > prevXp.current) {
      const diff = xp - prevXp.current;
      setToastText(`+${diff} XP`);
      toastAnim.setValue(0);
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 2600,
        useNativeDriver: true,
      }).start(() => setToastText(null));
    }
    prevXp.current = xp;
  }, [xp, toastAnim]);

  const progressToNext = xp % XP_PER_LEVEL;
  const progressPct = Math.min(1, progressToNext / XP_PER_LEVEL);

  return (
    <View style={styles.container}> 
      <View style={styles.left}> 
        <Text style={[styles.level, { color: theme.colors.text }]}>{`Lv ${level}`}</Text>
        <View style={styles.xpBarBackground}>
          <Animated.View style={[styles.xpBarFill, { width: `${progressPct * 100}%`, backgroundColor: theme.colors.secondary }]} />
        </View>
      </View>

      {toastText && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              opacity: toastAnim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [10, -8] }) },
                { scale: toastAnim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.9, 1.05, 1] }) },
              ],
            },
          ]}
        >
          <Text style={styles.toastText}>{toastText}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  left: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  level: {
    fontSize: 12,
    fontWeight: '700',
  },
  xpBarBackground: {
    width: 80,
    height: 6,
    backgroundColor: '#ffffff22',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 4,
  },
  xpBarFill: {
    height: '100%',
  },
  right: {
    marginLeft: 4,
  },
  toast: {
    position: 'absolute',
    top: -30,
    right: 0,
    backgroundColor: '#000000ee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
