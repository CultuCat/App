import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  const Item = ({ title, ubicacion, data, image, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
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
  const [urldef, setUrldef] = useState('https://cultucat.hemanuelpc.es/');
  const [customMarkers, setCustomMarkers] = useState([]);
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
  const [nMarkers, setNMarkers] = useState(1300);

  useEffect(() => {
    fetchMarkers(customRegion);
  }, []); // empty dependency array to only run once on mount
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
          setEvents(
            data.results.map((item) => ({
              id: item.id,
              title: item.nom,
              data: item.dataIni,
              //ubicacion: item.espai.nom,
              image: item.imatges_list.length > 0 ? { uri: item.imatges_list[0] } : 'https://www.legrand.es/modules/custom/legrand_ecat/assets/img/no-image.png',
            }))
          );
        })
        .catch((error) => console.error(error));
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
        placeholder={t('Friendlist.Busca')}
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
          <Text style={styles.eventsText}>{t('Map.Esdeveniments')}</Text>
        </TouchableOpacity>

      </View>
      {showEvents && (
        <View style={styles.list}>
          <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <Item
                title={item.title}
                data={item.data}
                ubicacion={item.ubicacion}
                image={item.image}
                onPress={() => handlePressEvent(item.id)}
              />
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
  list: {
    marginVertical: 0,
    paddingVertical: 0,
    flex: 1
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
    marginVertical: 0,
    paddingVertical: 0,
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
    height: 40,
  },
});
