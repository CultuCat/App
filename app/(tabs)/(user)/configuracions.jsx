import React from 'react';
import { Text } from 'react-native';
import { View, Button, StyleSheet, Image,TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href={'/'} replace asChild>
      <Button title='Log out' />
    </Link>
    )
}