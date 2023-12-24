import React, { useEffect, useState } from 'react';
import { Alert, Image, View, Text, Button, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import colors from '../constants/colors';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleButton from './components/googleButton';
import Divider from './components/divider';
import { useTranslation } from 'react-i18next';


export default function Page() {
    const { t } = useTranslation();
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: 'CLIENT_ID',
        iosClientId: '852693017999-3bur3t29c1stjg1ft95njoagkjfao394.apps.googleusercontent.com',
        androidClientId: '852693017999-rmrneotl5b6j5p5sf5ukequup60rtrmi.apps.googleusercontent.com',

    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        getLocalUser();
        handleSignInWithGoogle();
    }, [response])

    const getLocalUser = async () => {
        const data = await AsyncStorage.getItem("@user");
        if (!data) return null;
        router.replace('/(tabs)/home');
    }

    async function handleSignInWithGoogle() {
        if (response?.type === "success") {
            getUserInfo(response.authentication.accessToken);
        }
    }

    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.ok) {
                const user = await response.json();
                const username = user.email.split('@')[0];
                setUsername(username);
                setPassword(token.substring(0, 20));
                onLoginPress();
            } else {
                console.error(`Error al obtener la información del usuario: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onLoginPress = () => {
        fetch("https://cultucat.hemanuelpc.es/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Incorrect username or password");
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    AsyncStorage.setItem("@user", JSON.stringify(data));
                    router.replace('/(tabs)/home');
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                Alert.alert("Error", t('Index.Eror_credencials'));
            });
    };

    return (
        <View style={[{flex: 1}, Platform.OS === 'android' && styles.androidView]}>
            <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
                <View style={styles.imageContainer}>
                    <Image
                        style={{ flex: 1, resizeMode: 'contain' }}
                        source={require('../assets/full-logo.png')}
                    />
                </View>
                <View style={styles.centeredContent}>
                    <Text style={styles.title}>{t('Index.Benvingut')}</Text>
                    <GoogleButton onPress={() => {
                        promptAsync();
                    }} />
                    <Divider />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Index.User')}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Index.Password')}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.login} onPress={onLoginPress}>
                        <Text style={styles.loginText}>LOGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.replace('signup')}>
                        <Text style={styles.signup}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    androidView: {
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    androidMarginTop: {
        marginTop: 40,
    },
    imageContainer: {
        margin: 15,
        width: '70%',
        aspectRatio: 3.6,
        alignItems: 'center'
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: '25%',
        width: '80%',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: colors.primary,
        marginVertical: 10,
        paddingHorizontal: 10,

    },
    login: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    loginText: {
        fontSize: 18,
        color: 'white',
    },
    signup: {
        color: colors.primary,
        marginVertical: 10,
        textDecorationLine: 'underline',
    },
});
