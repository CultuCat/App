import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image } from 'react-native';

export default function Page() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`https://cultucat.hemanuelpc.es/events/?espai=${2}`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.results);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={{ uri: item.imatges_list[0] }} style={styles.image} />
      <View style={styles.itemText}>
        <Text style={styles.title}>{item.nom}</Text>
        <Text style={styles.data}>{item.dataIni}</Text>
        <Text style={styles.ubicacion}>{item.espai.nom}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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