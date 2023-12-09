import React, { useEffect, useState } from 'react';
import { Alert, Image, View, Text, Button, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function Page() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const { t } = useTranslation();

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
        <SafeAreaView style={styles.container}>
            <Image
                style={{ margin: 15, width: 270, height: 75 }}
                source={require('../assets/full-logo.png')}
            />
            <View style={styles.centeredContent}>
                <Text style={styles.title}>{t('Signup.Registrat')}</Text>
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
                <Button title="Signup" onPress={onSignupPress} />
                <Button title="Login" onPress={() => navigation.replace('index')} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
});
