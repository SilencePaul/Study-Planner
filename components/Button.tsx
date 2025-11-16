import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/context';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onPress,
  style,
  textStyle,
  disabled,
  children,
}) => {
  const { theme } = useTheme();

  const baseStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  };

  const primaryStyle: ViewStyle = {
    backgroundColor: theme.colors.primary,
  };

  const secondaryStyle: ViewStyle = {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  };

  const primaryText: TextStyle = {
    color: '#FFFFFF',
    fontWeight: '600',
  };

  const secondaryText: TextStyle = {
    color: theme.colors.text,
    fontWeight: '600',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[baseStyle, variant === 'primary' ? primaryStyle : secondaryStyle, style]}
    >
      <Text style={[variant === 'primary' ? primaryText : secondaryText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
