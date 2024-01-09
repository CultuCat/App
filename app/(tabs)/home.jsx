import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, FlatList, StyleSheet, SafeAreaView, View, Platform, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from '../components/eventCard.jsx';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors.js';


export default function Page() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    setLoading(true);
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

  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };

  const handleList = (title, path) => {
    navigation.navigate('eventList', { title, path });
  };
  

  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <Text style={styles.title}>{t('Home.Welcome')}, {name}</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '5%',
              marginTop: '3%',
            }}>
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleList(t('Home.Today'), 'today')}>
                <View style={styles.button}>
                  <MaterialCommunityIcons name="calendar-today" size={50} color="white" />
                </View>
                <Text>{t('Home.Today')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleList(t('Home.Week'), 'this_week')}>
                <View style={styles.button}>
                  <MaterialCommunityIcons name="calendar-week" size={50} color="white" />
                </View>
                <Text style={{ flexWrap: 'wrap', width: 70, textAlign: 'center', }}>{t('Home.Week')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleList(t('Home.Free'), 'free')}>
                <View style={styles.button}>
                  <MaterialCommunityIcons name="currency-usd-off" size={50} color="white" />
                </View>
                <Text>{t('Home.Free')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleList(t('Home.Trendy'), 'popular')}>
                <View style={styles.button}>
                  <Ionicons name="trending-up" size={50} color="white" />
                </View>
                <Text>{t('Home.Trendy')}</Text>
              </TouchableOpacity>
            </View>
            {events.map((item) => (
              <EventCard
                key={item.id}
                event={item.nom}
                dataIni={item.dataIni}
                dataFi={item.dataFi}
                imatge={item.imatges_list[0]}
                espai={item.espai.nom}
                onPress={() => handlePressEvent(item.id)}
              />
            ))}
          </ScrollView>
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
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    width: 70,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  }
});
