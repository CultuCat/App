import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EventPreview from './components/eventPreview';
import { useTranslation } from 'react-i18next';
import colors from '../constants/colors';

export default function Page() {
  const { t } = useTranslation();
  const [customMarkers, setCustomMarkers] = useState([]);
  const [customRegion, setCustomRegion] = useState({
    latitude: 41.3927672,
    longitude: 2.057617,
    latitudeDelta: 3,
    longitudeDelta: 4,
  });
  const [events, setEvents] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [nMarkers, setNMarkers] = useState(1300);

  useEffect(() => {
    fetchMarkers(customRegion);
  }, []);
  const navigation = useNavigation();
  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };
  const fetchMarkers = (region) => {
    const { latitude, longitude } = region;
    setNMarkers(Math.floor(Math.max((customRegion.longitudeDelta * 120), 20)));
    const url = `https://cultucat.hemanuelpc.es/spaces/?latitud=${latitude}&longitud=${longitude}&num_objs=${nMarkers}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCustomMarkers(
          data.map((item) => ({
            key: item.id,
            latlng: { latitude: item.latitud, longitude: item.longitud },
            title: item.nom,
            description: item.description,
            events: item.events,
          }))
        );
      })
      .catch(() => console.error("Error fetching markers"));
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
      const url = `https://cultucat.hemanuelpc.es/events/?espai=${marker.key}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setEvents(data);
        })
        .catch((error) => console.error(error));
    } else {
      setSelectedMarker(null);
      setEvents([]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={() => navigation.goBack()}>
        <Ionicons name="ios-close-outline" size={36} color="black" />
      </TouchableOpacity>
      <MapView
        style={styles.map}
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
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.button}>
          <Text style={styles.eventsText}>{t('Map.Esdeveniments')}</Text>
        </View>
        {selectedMarker ? (
          <View style={styles.eventList}>
            <FlatList
              data={events.results}
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
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: '5%' }}
            />
          </View>
        ) : (
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {t('Map.Click')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
    zIndex: 2,
  },
  closeIcon: {
    top: 50,
    right: '5%',
  },
  eventList: {
    marginBottom: '5%',
    flex: 1,
  },
  map: {
    width: '100%',
    height: '60%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6961',
  },
  eventsText: {
    color: 'white',
    marginLeft: 2.5,
    fontSize: 20,
  },
  markerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    marginVertical: 0,
    paddingVertical: 0,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalText: {
    fontSize: 18,
    marginBottom: '10%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
