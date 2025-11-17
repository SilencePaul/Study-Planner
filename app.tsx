import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createCommonStyles } from '@/theme/styles';
import { lightTheme } from '@/theme';

export default function App() {
  const common = createCommonStyles(lightTheme);
  return (
    <View style={common.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
