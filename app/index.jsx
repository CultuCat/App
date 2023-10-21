import React from 'react';
import { Link } from 'expo-router';
import { Image, View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function Page() {
    return (
        <View style={styles.container}>
            <Image
                style={{ margin: 15, width: 270, height: 75 }}
                source={require('../assets/full-logo.png')}
            />
            <View style={styles.centeredContent}>
                <Text style={styles.title}>Benvingut</Text>
                <Text style={styles.subtitle}>Sisplau inicia sesió amb google per poder accedir</Text>
            </View>
            <View style={styles.centeredContent2}>
                <Link href={'/(tabs)/home'} replace asChild>
                    <Button title='Log in' />
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center', // Centrar horizontalmente
        justifyContent: 'flex-start', // Colocar la imagen en la parte superior
    },
    centeredContent: {
        flex: 1, // Para que los elementos ocupen todo el espacio vertical
        justifyContent: 'center', // Centrar verticalmente en el espacio disponible
    },
    centeredContent2: {
        alignItems: 'center', // Centrar horizontalmente
        flex: 1, // Para que los elementos ocupen todo el espacio vertical
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 15,
        color: colors.greyText,
    },
});
