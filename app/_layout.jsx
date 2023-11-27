import React from 'react';
import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
          headerShown: false,
        }} />
        <Stack.Screen
        name="signup"
        options={{
          title: 'Signup',
          headerShown: false,
        }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }} />
        <Stack.Screen
        name="event"
        options={{
          headerShown: false,
        }} />
    </Stack>
  );
}
