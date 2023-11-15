import React from 'react';
import { Link } from 'expo-router';
import { Text, Button, View, TouchableOpacity } from 'react-native';

export default function Page() {
    return (
        <View>
            <Text>Home page</Text>
            
            <Link href={{ pathname: '/event', params: { path: '/(tabs)/home',  eventId: '20231011039' } }} replace asChild>
            <Button title='Event' />
            </Link>
        </View>
    );
}