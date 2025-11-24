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
      {/* 上面一行：小号文字 + 等级 */}
      <View style={styles.levelRow}>
        <Text
          style={[
            styles.levelLabel,
            { color: theme.colors.text + '88' as string },
          ]}
        >
          Level
        </Text>
        <Text
          style={[
            styles.levelValue,
            { color: theme.colors.text },
          ]}
        >
          {`Lv ${level}`}
        </Text>
      </View>

      {/* 下面一条细进度条 */}
      <View style={styles.xpBarBackground}>
        <Animated.View
          style={[
            styles.xpBarFill,
            {
              width: `${progressPct * 100}%`,
              backgroundColor: theme.colors.secondary,
            },
          ]}
        />
      </View>

      {/* XP 增加的浮动 toast */}
      {toastText && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              opacity: toastAnim.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, -6],
                  }),
                },
                {
                  scale: toastAnim.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0.9, 1.05, 1],
                  }),
                },
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
  // 整体变成一个小信息块，竖直排布
  container: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginRight: 4,
  },
  levelValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  xpBarBackground: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // 在蓝色 header 上比较柔和
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 4,
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  toast: {
    position: 'absolute',
    top: -22,
    right: 0,
    backgroundColor: '#000000dd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  toastText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
