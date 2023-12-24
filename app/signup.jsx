import React, { useEffect, useState } from 'react';
import { Alert, Image, View, Text, Button, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleButton from './components/googleButton';
import Divider from './components/divider';
import { useTranslation } from 'react-i18next';

export default function Page() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: 'CLIENT_ID',
        iosClientId: '852693017999-3bur3t29c1stjg1ft95njoagkjfao394.apps.googleusercontent.com',
        androidClientId: '852693017999-rmrneotl5b6j5p5sf5ukequup60rtrmi.apps.googleusercontent.com',

    });

    useEffect(() => {
        handleSignInWithGoogle();
    }, [response])

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
                setName(user.name);
                const username = user.email.split('@')[0];
                setUsername(username);
                setEmail(user.email);
                setPassword(token.substring(0, 20));
                setPassword2(token.substring(0, 20));
                onSignUpPress();
            } else {
                console.error(`Error al obtener la información del usuario: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };


    const onSignupPress = () => {
        if (password !== password2) {
            Alert.alert("Error", t('Signup.Password_not_equal'));
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
                        Alert.alert("Error", t('Signup.Username_existeix'));
                    } else {
                        Alert.alert("Error", t('Signup.Email_existeix'));
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
            <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
            <View style={styles.imageContainer}>
                    <Image
                        style={{ flex: 1, resizeMode: 'contain' }}
                        source={require('../assets/full-logo.png')}
                    />
                </View>
                <View style={styles.centeredContent}>
                    <Text style={styles.title}>{t('Signup.Registrat')}</Text>
                    <GoogleButton onPress={() => {
                        promptAsync();
                    }} />
                    <Divider />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Edit_User.Nom')}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Edit_User.Username')}
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Signup.Email')}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Index.Password')}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Signup.Repetir_password')}
                        value={password2}
                        onChangeText={setPassword2}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.signup} onPress={onSignupPress}>
                        <Text style={styles.signupText}>SIGNUP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.replace('index')}>
                        <Text style={styles.login}>Login</Text>
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
        alignItems: 'center'
    },
    androidMarginTop: {
        marginTop: 30,
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
        marginBottom: 100,
        width: '80%'
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
    signup: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    signupText: {
        fontSize: 18,
        color: 'white',
    },
    login: {
        color: colors.primary,
        marginVertical: 10,
        textDecorationLine: 'underline',
    },
});
