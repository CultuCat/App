import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TicketCard from '../components/ticketCard.jsx';
import { useNavigation } from '@react-navigation/native';

export default function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getLocalUser();
      fetchAllEvents(userInfo.map(item => item.id))
        .then(allEvents => {
          setEvents(allEvents.flat());
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    };
    fetchData();
  }, []);

  const fetchEventsById = async (id) => {
    const response = await fetch(`https://cultucat.hemanuelpc.es/events/?espai=${id}`);
    const data = await response.json();
    return data.results;
  }

  const fetchAllEvents = async (ids) => {
    const promises = ids.map(id => fetchEventsById(id));
    const allEvents = await Promise.all(promises);
    return allEvents;
  }

  const getLocalUser = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;
      const data = JSON.parse(dataString);
      setName(data.user.first_name);
      return data.user.espais_preferits;
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
    <TicketCard
      event={item.nom}
      data={item.dataIni}
      imatge={item.imatges_list[0]}
      espai={item.espai.nom}
      onPress={() => handlePressEvent(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <View style={{flex: 1}}>
            <Text style={styles.title}>Benvingut, {name}</Text>
            <FlatList
              data={events}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ alignItems: 'center' }}
            />
          </View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 25,
    marginVertical: 10,
    marginHorizontal: '5%',
  },
});
