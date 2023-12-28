import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router/stack';
import i18next from '../languages/i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Layout() {
  const [lang, setLang] = useState('cat');

  const getLocalUser = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;
      const data = JSON.parse(dataString);
      return data.user.id;
    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await getLocalUser();
        if (!userID) {
          console.error('User ID not found in AsyncStorage');
          return;
        }

        const userTokenString = await AsyncStorage.getItem("@user");
        if (!userTokenString) {
          console.error('User token not found in AsyncStorage');
          return;
        }

        const userToken = JSON.parse(userTokenString).token;
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userID}`, {
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }

        const userData = await response.json();
        setLang(userData.language);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);



  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
          headerShown: false,
        }} />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Signup',
          headerShown: false,
        }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name="event"
        options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name="eventList"
        options={{
          headerShown: false,
        }} />
    </Stack>
  );
}
