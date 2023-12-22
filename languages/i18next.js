import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ca from './ca.json';
import es from './es.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';


export const languageResources = {
    en: { translation: en },
    cat: { translation: ca },
    es: { translation: es },
};

/*const initializeI18Next = (lng) => {
    return i18next.use(initReactI18next).init({
        compatibilityJSON: 'v3',
        lng: lng,
        fallbackLng: 'ca',
        resources: languageResources,
    });
};*/

const useUserData = () => {
    const [user, setUser] = useState(null);


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
            console.log(userData.language);
            initializeI18Next(userData.language);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        };

        fetchData();
    }, []);
}


i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'cat',
    fallbackLng: 'cat',
    resources: languageResources,
});

export default i18next;
