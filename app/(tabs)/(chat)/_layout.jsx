import React from 'react';
import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
        }} />
        <Stack.Screen
        name="chatScreen"
        options={{
          headerShown: false,
        }} />
    </Stack>
  );
};
