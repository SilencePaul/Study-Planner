import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import NewAssignmentScreen from './new';

export default function EditAssignmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <NewAssignmentScreen />;
}

