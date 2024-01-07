import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView, View } from 'react-native';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import EventPreview from './components/eventPreview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';


export default function Page() {
  const route = useRoute();
  const { title, path } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    setLoading(true);
    const userString = await AsyncStorage.getItem("@user");
    const token = JSON.parse(userString).token;
    fetch(`https://cultucat.hemanuelpc.es/events/${path}`, {
      method: "GET",
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };

  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <View style={{ marginHorizontal: '5%' }}>
          <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={() => navigation.goBack()}>
            <Ionicons name="ios-close-outline" size={36} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <EventPreview
                event={item.nom}
                dataIni={item.dataIni}
                dataFi={item.dataFi}
                espai={item.espai.nom}
                imatge={item.imatges_list[0]}
                onPress={() => handlePressEvent(item.id)}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: '5%' }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
  },
  closeIcon: {
    top: 10,
    right: 0,
  },
});
