import React, { useEffect, useState } from 'react';
import { Alert, Image, View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Page() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const onSignupPress = () => {
        if (password !== password2) {
            Alert.alert("Error", "Les contrasenyes no són iguals");
        } else {
            fetch('https://cultucat.hemanuelpc.es/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: name,
                    username: username,
                    email: email,
                    password: password,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        AsyncStorage.setItem("@user", JSON.stringify(data));
                        router.replace('/(tabs)/home');
                    } else if (data.username) {
                        Alert.alert("Error", "Ja existeix una usuari amb aquest username");
                    } else {
                        Alert.alert("Error", "Ja existeix una usuari amb aquest email");
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <View style={styles.container}>
            <View style={{marginTop: 60}}>
                <Image
                    style={{ margin: 15, width: 270, height: 75 }}
                    source={require('../assets/full-logo.png')}
                />
                <View style={styles.centeredContent}>
                    <Text style={styles.title}>Registra't</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Repite Password"
                        value={password2}
                        onChangeText={setPassword2}
                        secureTextEntry
                    />
                    <Button title="Signup" onPress={onSignupPress} />
                    <Button title="Login" onPress={() => navigation.replace('index')} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 100,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
});