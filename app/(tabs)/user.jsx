import React from 'react';
import { Text, View, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Text>User page</Text>
      <Link href={'/'} replace asChild>
        <Button title='Log out' />
      </Link>
    </View>
  );
}