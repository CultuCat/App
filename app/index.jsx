import React from 'react';
import { Link } from 'expo-router';
import { View, Button } from 'react-native';

export default function Page() {
    return (
        <View>
            <Link href={'/(tabs)/home'} replace asChild>
                <Button title='Log in' />
            </Link>
        </View>
    );
}
