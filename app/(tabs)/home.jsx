import React from 'react';
import { Link } from 'expo-router';
import { Text, Button, View } from 'react-native';

export default function Page() {
    return (
        <View>
            <Text>Home page</Text>
            <Link href={'/event'} replace asChild params={{ path: '/(tabs)/home' }}>
                <Button title='Event' />
            </Link>
        </View>
    );
}