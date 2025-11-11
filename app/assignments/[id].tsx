import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import NewAssignmentScreen from './new';

export default function EditAssignmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: This would load and edit the specific assignment
  return <NewAssignmentScreen />;
}

