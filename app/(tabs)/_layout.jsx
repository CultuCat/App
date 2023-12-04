import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { useTranslation } from 'react-i18next';

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
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-home" size={size} color={color} />,
        }} />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-search" size={size} color={color} />,
        }} />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-bookmark" size={size} color={color} />,
        }} />
      <Tabs.Screen
        name="chat"
        options={{
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