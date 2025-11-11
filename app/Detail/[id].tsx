import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DetailScreen from './_index';

export default function DetailSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: This would show/edit a specific session
  return <DetailScreen />;
}

