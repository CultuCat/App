import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TicketCard from '../components/ticketCard.jsx';
import { useNavigation } from '@react-navigation/native';

export default function Page() {
  const [events, setEvents] = useState([]);
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getLocalUser();
      setInfo(userInfo);
      fetchAllEvents(userInfo.map(item => item.id))
        .then(allEvents => {
          setEvents(allEvents.flat())
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
        onPress= {() => handlePressEvent(item.id)}
      />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Suggested Events</Text>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: '#e0e0e0',
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 20,
      flexDirection: 'row',
      marginTop: 14,
    },
    image: {
      width: 70,
      height: 70,
      marginRight: 10,
      borderRadius: 10
    },
    itemText: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    ubicacion: {
      fontSize: 12,
      fontStyle: 'italic',
    },
    data: {
      fontSize: 12,
      color: '#f07b75',
      marginTop: 5,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    text: {
      padding: 10,
      backgroundColor: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    list:{
      marginVertical:0,
      paddingVertical:0,
      flex:1
    },
    map: {
      width: '100%',
      height: '80%',
    },
    buttonEvents: {
      width: '100%',
      height: '80%',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      height: '100vh',
      backgroundColor: '#ff6961',
    },
    eventsText: {
      color: 'white',
      marginLeft: 2.5,
      fontSize: 20,
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
      height: '10%',
    },
    markerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      padding: 10,
      marginVertical:0,
      paddingVertical:0,
    },
    searchBarContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
    },
    searchBarInputContainer: {
      backgroundColor: '#fff',
      borderRadius: 20,
      height: 40,
    },
  });