import React, { useEffect, useState } from 'react';
import { Alert, Image, View, Text, Button, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import colors from '../constants/colors';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleButton from './components/googleButton';
import Divider from './components/divider';
import { useTranslation } from 'react-i18next';


export default function Page() {
    const { t } = useTranslation();

    const [userInfo, setUserInfo] = React.useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: 'CLIENT_ID',
        iosClientId: '852693017999-3bur3t29c1stjg1ft95njoagkjfao394.apps.googleusercontent.com',
        androidClientId: '852693017999-rmrneotl5b6j5p5sf5ukequup60rtrmi.apps.googleusercontent.com',

    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    React.useEffect(() => {
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

    /*async function handleSignInWithGoogle() {
        if (response?.type === "success") {
          const accessToken = response.authentication.accessToken;
          const response = await fetch('http://localhost:8000/users/sign_in/google-oauth2/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token: accessToken }),
          });
      
          if (response.status === 200) {
            const data = await response.json();

          }
        }
      }*/


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
        <SafeAreaView style={styles.container}>
            <Image
                style={{ margin: 15, width: 270, height: 75 }}
                source={require('../assets/full-logo.png')}
            />
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
                <Button title="Login" onPress={onLoginPress} />
                <Button title="Signup" onPress={() => router.replace('signup')} />
            </View>
        </SafeAreaView>
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
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,

    },
});
