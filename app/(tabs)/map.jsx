import React, {useState,useEffect} from 'react';
import {  StyleSheet,Text, View, Button, FlatList } from 'react-native';
import { Link } from 'expo-router';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

export default function Page() {
  const [customMarkers, setCustomMarkers] = useState([
    {
      latlng: { latitude: 41.3927672, longitude: 2.057617 },
      title: 'Marker 1',
      events: ['Event 1', 'Event 2'],
    },
    {
      latlng: { latitude: 41.392, longitude: 2.058 },
      title: 'Marker 2',
      events: ['Event 3', 'Event 4'],
    },
    {
      latlng: { latitude: 41.393, longitude: 2.058 },
      title: 'Marker 3',
      events: ['Event 5', 'Event 6'],
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
  useEffect(() => {
    fetchMarkers(customRegion);
  }, []); // empty dependency array to only run once on mount

  fetchMarkers = (region) => {
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
      <View style={[styles.buttonContainer, showEvents && { height: '10%' }]}>
        <Button title="Esdeveniments" onPress={() => toggleEvents(selectedMarker)} disabled={!selectedMarker} />
      </View>
      {showEvents && (
        <View style={{ height: '30%' }}>
          <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
          <FlatList
            data={events}
            renderItem={({ item }) => <Text>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            style={{ height: '100%' }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  map: {
    width: '100%',
    height: '80%',
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
  },
});