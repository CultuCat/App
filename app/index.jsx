import React, { useEffect } from 'react';
import { Link } from 'expo-router';
import { Image, View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage'

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
    const [userInfo, setUserInfo] = React.useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: 'CLIENT_ID',
        iosClientId: '852693017999-3bur3t29c1stjg1ft95njoagkjfao394.apps.googleusercontent.com',
        androidClientId: '852693017999-rmrneotl5b6j5p5sf5ukequup60rtrmi.apps.googleusercontent.com',

    });

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
        return JSON.parse(data);
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
            const user = await response.json();
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            setUserInfo(user);
        } catch (e) {
            console.log(e);
        }
    };


    return (
        <View style={styles.container}>
            {!userInfo ? (
                <View>
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
                            <Button
                                title='Log in'
                                disabled={!request}
                                onPress={() => {
                                    promptAsync();
                                }}
                            />
                        </Link>
                    </View>
                </View>) : (<View></View>)}
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
    },
    centeredContent2: {
        alignItems: 'center',
        flex: 1,
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
