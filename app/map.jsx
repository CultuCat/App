import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import { Link } from 'expo-router';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';
import { MaterialIcons } from "@expo/vector-icons";

export default function Page() {
  const Item = ({ title, ubicacion, data, image }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={image} style={styles.image} />
      <View style={styles.itemText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.data}>{data}</Text>
        <Text style={styles.ubicacion}>{ubicacion}</Text>
        <TouchableOpacity>
          <MaterialIcons
          style={styles.ticket}
          name="local-activity"    
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const [customMarkers, setCustomMarkers] = useState([
    {
      latlng: { latitude: 41.3894491, longitude: 2.1107903 },
      title: 'FIB',
      events: [
        {
          id: '1',
          title: 'Barcelona Tech',
          data: 'dg, 22 octubre',
          ubicacion: 'Barcelona',
          image: require('../assets/teatro.png')
        },

      ],
    },
    {
      latlng: { latitude: 41.385844, longitude: 2.0346453 },
      title: 'Sant Feliu de Llobregat',
      events: [
        {
          id: '2',
          title: 'Rooftop Party',
          data: 'dg, 22 octubre',
          ubicacion: 'Barcelona',
          image: require('../assets/rooftop.png')
        },

      ],
    },
    {
      latlng: { latitude: 41.1258353, longitude: 1.2179839 },
      title: 'Tarragona',
      events: [
        {
          id: '3',
          title: 'Fira Àpat',
          data: 'dg, 22 octubre',
          ubicacion: 'Tarragona',
          image: require('../assets/rooftop.png')
        },
        {
          id: '4',
          title: 'Obra Romeu i Julieta',
          data: 'dg, 22 octubre',
          ubicacion: 'Reus',
          image: require('../assets/teatro.png')
        },
      ],
    },
  ]);
  const [customRegion, setCustomRegion] = useState({
    latitude: 41.3927672,
    longitude: 2.057617,
    latitudeDelta: 3,
    longitudeDelta: 4,
  });
  const [showEvents, setShowEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMarkers(customRegion);
  }, []); // empty dependency array to only run once on mount

  const fetchMarkers = (region) => {
    console.log('fetching markers');
    const { latitude, longitude } = region;
    const url = `http://nattech.fib.upc.edu:40401/spaces/?latitud=${region.latitud}&longitud=${region.longitude}&num_objs=10`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCustomMarkers(
          data.map((item) => ({
            //key: item.id,
            latlng: { latitude: item.latitud, longitude: item.longitud },
            title: item.nom,
            //description: item.description,
            events: item.events,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const onTouchEnd = () => {
    fetchMarkers(customRegion);
  };

  const onRegionChange = (region) => {
    setCustomRegion(region);
  };

  const toggleEvents = (marker) => {
    if (marker) {
      setSelectedMarker(marker);
      setEvents(marker.events);
    } else {
      setSelectedMarker(null);
      setEvents([]);
    }
    setShowEvents(!!marker);
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.map, showEvents && { height: '60%' }]}
        initialRegion={customRegion}
        onRegionChange={onRegionChange}
        onTouchEnd={onTouchEnd}
        onEnd
      >
        {customMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            events={marker.events}
            onPress={() => toggleEvents(marker)}
          />
        ))}
      </MapView>
      <SearchBar
        inputContainerStyle={styles.searchBarInputContainer}
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        platform="ios"
        containerStyle={styles.searchBarContainer}
      />
      <View style={[styles.buttonEvents, showEvents && { height: '10%' }]}>
  <TouchableOpacity
    title="Esdeveniments"
    onPress={() => toggleEvents(selectedMarker)}
    disabled={!selectedMarker}
    style={styles.button}
  >
    <Text style={styles.eventsText}> Esdevenimets</Text>
  </TouchableOpacity>

</View>
      {showEvents && (
        <View style={styles.list}>
          <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <Item title={item.title} data={item.data} ubicacion={item.ubicacion} image={item.image} />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </View>
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
