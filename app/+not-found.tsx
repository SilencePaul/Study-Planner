import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useTheme } from '@/theme/context';
import { createCommonStyles } from '@/theme/styles';

export default function NotFoundScreen() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  const { theme } = useTheme();
  const common = createCommonStyles(theme);

  useEffect(() => {
    console.log('Not Found Screen - Segments:', segments);
    console.log('Not Found Screen - Pathname:', pathname);
    if (pathname === '/' || pathname === '' || Number(segments.length) === 0) {
      console.log('Auto-redirecting to home...');
      setTimeout(() => {
        router.replace('/');
      }, 100);
    }
  }, [pathname, segments, router]);

  const handleGoHome = () => {

    try {
      router.replace('/');
    } catch (error) {
      console.error('Navigation error:', error);
      router.push('/');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={[common.container, { backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Unmatched Route</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text } ]}>Page could not be found. Go back.</Text>
        <TouchableOpacity
          style={[common.primaryButton, { backgroundColor: theme.colors.primary, marginTop: 20 }]}
          onPress={handleGoHome}
        >
          <Text style={common.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

