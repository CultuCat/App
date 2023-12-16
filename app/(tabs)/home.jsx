import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, FlatList, StyleSheet, SafeAreaView, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from '../components/eventCard.jsx';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const token = await getToken();
    fetch('https://cultucat.hemanuelpc.es/events/home', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const getToken = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;
      const data = JSON.parse(dataString);
      setName(data.user.first_name);
      return data.token;
    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };

  const navigation = useNavigation();
  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };

  const renderItem = ({ item }) => (
    <EventCard
      event={item.nom}
      data={item.dataIni}
      imatge={item.imatges_list[0]}
      espai={item.espai.nom}
      onPress={() => handlePressEvent(item.id)}
    />
  );

  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <Text style={styles.title}>{t('Index.Benvingut')}, {name}</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
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
  },
  androidMarginTop: {
    marginTop: 40,
  },
  title: {
    fontSize: 25,
    marginBottom: 8,
    marginHorizontal: '5%',
  },
});
