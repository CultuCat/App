import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#ff6961',
      },
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#e0e0e0',
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
        name="user"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="ios-person" size={size} color={color} />,
        }} />
    </Tabs>
  );
}
