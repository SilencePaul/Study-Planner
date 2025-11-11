import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

export default function NotFoundScreen() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

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
      <View style={styles.container}>
        <Text style={styles.title}>Unmatched Route</Text>
        <Text style={styles.subtitle}>Page could not be found. Go back.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGoHome}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

