import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

export default function Layout() {
  return (
    <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: colors.primary,
      },
      tabBarActiveTintColor: colors.white,
      tabBarInactiveTintColor: colors.tapIconDefault,
    }}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-home" size={size} color={color} />,
        }} />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-search" size={size} color={color} />,
        }} />
      <Tabs.Screen
        name="tickets"
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-bookmark" size={size} color={color} />,
        }} />
      <Tabs.Screen
        name="(chat)"
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-chatbox" size={size} color={color} />,
        }} />
      <Tabs.Screen
        name="(user)"
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-person" size={size} color={color} />,
        }} />
    </Tabs>
  );
}
