import React, {useState,useEffect} from 'react';
import {  StyleSheet,Text, View, Button } from 'react-native';
import { Link } from 'expo-router';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

export default function Page() {
  const [customMarkers, setCustomMarkers] = useState([]);
  const [customRegion, setCustomRegion] = useState({latitude: 41.3927672,
                                                    longitude: 2.057617,
                                                    latitudeDelta: 3,
                                                    longitudeDelta: 4,});
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
        setCustomMarkers(data.map((item) => ({
          //key: item.id,
          latlng: { latitude: item.latitud, longitude: item.longitud },
          title: item.nom,
          //description: item.description,
        })))
      })
      .catch((error) => console.error(error));
  };
  const onTouchEnd = () =>{
    fetchMarkers(customRegion);
  }
  const onRegionChange = (region) =>{
    setCustomRegion(region)
  };
  return (
      <View style={styles.container}>
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
            />
          ))}
        </MapView>
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});