import React, { useEffect, useState } from 'react';
import { Alert, Image, View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleButton from './components/googleButton';
import Divider from './components/divider';

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = React.useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: 'CLIENT_ID',
        iosClientId: '852693017999-3bur3t29c1stjg1ft95njoagkjfao394.apps.googleusercontent.com',
        androidClientId: '852693017999-rmrneotl5b6j5p5sf5ukequup60rtrmi.apps.googleusercontent.com',

    });
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    useEffect(() => {
        handleSignInWithGoogle();
    }, [response])

    async function handleSignInWithGoogle() {
        const user = await getLocalUser();
        if (!user) {
            if (response?.type === "success") {
                getUserInfo(response.authentication.accessToken);
            }
        }
        else {
            setUserInfo(user);
        }
    }

    const getLocalUser = async () => {
        const data = await AsyncStorage.getItem("@user");
        if (!data) return null;
        router.replace('/(tabs)/home');
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
                await AsyncStorage.setItem("@user", JSON.stringify(user));
                setUserInfo(user);

                await postUserData(token);
            } else {
                console.error(`Error al obtener la información del usuario: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const postUserData = async (token) => {
        try {
            const postResponse = await fetch(
                "http://localhost:8000/users",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({}),
                }
            );

            if (postResponse.ok) {
                console.log("Información del usuario enviada con éxito.");
            } else {
                console.error(`Error al enviar la información del usuario: ${postResponse.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onLoginPress = () => {
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
                    <GoogleButton onPress={() => {
                        promptAsync();
                    }} />
                    <Divider />
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
                    <Button title="Signup" onPress={onLoginPress} />
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
    subtitle: {
        fontSize: 15,
        color: colors.greyText,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
});
