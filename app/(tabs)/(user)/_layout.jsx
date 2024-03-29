import React from 'react';
import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="user"
        options={{
          title: 'User',
          headerShown: false,
        }} />
        <Stack.Screen
        name="profilefriend"
        options={{
          headerShown: false,
        }} />
        <Stack.Screen
        name="friendslist"
        options={{
          headerShown: false,
        }} />
    </Stack>
  );
};
