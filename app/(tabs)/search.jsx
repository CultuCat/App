import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';

export default function Page() {
  const Item = ({ title, ubicacion, data, image, id}) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(id)}>
      <Image source={image} style={styles.image} />
      <View style={styles.itemText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.data}>{data}</Text>
        <Text style={styles.ubicacion}>{ubicacion}</Text>
        <TouchableOpacity>
          <MaterialIcons style={styles.ticket} name="local-activity" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loadMoreData = async () => {
    if (loading) return;
  
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/events/?page=${page + 1}`);
      const newData = await response.json();
  
      if (newData.results.length > 0) {
        setData((prevData) => [...prevData, ...newData.results]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  


  const navigation = useNavigation();
  const handlePressMap = () => {
    navigation.navigate('map');
  };
  const handlePress = (eventId) => {
    navigation.navigate('event', { eventId });
  };
  
  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };

  state = {
    search: '',
  };

  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/events/', {
      method: "GET"
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then((dataFromServer) => {
        setData(dataFromServer.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredData = data.filter((item) =>
    item.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        inputContainerStyle={styles.searchBarInputContainer}
        placeholder="Type Here..."
        onChangeText={(text) => setSearch(text)}
        value={search}
        platform="ios"
        containerStyle={styles.searchBarContainer}
      />

      <TouchableOpacity style={styles.filtersButton}>
        <MaterialIcons name="filter-list" style={styles.filtersIcon} />
        <Text style={styles.filtersText}> Filters</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.mapButton} onPress={handlePressMap}>
        <MaterialIcons name="location-on" style={styles.location} />
        <Text style={styles.mapText}> Veure mapa</Text>
      </TouchableOpacity>

      <FlatList
      data={filteredData}
      renderItem={({ item }) => (
        <Item title={item.nom} data={item.dataIni} ubicacion={item.espai} image={{ uri: item.imatges_list[0] }} id={item.id} />
      )}
      keyExtractor={(item) => item.id}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.1}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 14,
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
    borderRadius: 10,
    marginTop: 5,
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
  input2: {
    width: 290,
    height: 40,
    borderColor: '#f07b75',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    marginTop: -30,
    marginLeft: 20,
    borderRadius: 15,
    backgroundColor: '#e8e8e8',
  },
  camera: {
    fontSize: 20,
    color:'#f07b75',
    marginLeft: 330,
    marginTop: 30,
  },
  ticket: {
    fontSize: 19,
    color:'#f07b75',
    marginLeft: 190,
    marginTop: 5,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6961',
    padding: 10,
    borderRadius: 15,
    width: 90,
    marginLeft: 20,
    },
    filtersIcon: {
      fontSize: 20,
      color: 'white',
    },
    filtersText: {
      color: 'white',
      marginLeft: 2.5,
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      padding: 10,
      borderRadius: 15,
      width: 120,
      marginLeft: 120,
      borderColor: 'black',
      borderWidth: 1, 
      marginTop: -39,
      marginBottom: 8,
    },
    searchBarInputContainer: {
      width: 290,
      height: 30,
      borderWidth: 0,
      marginBottom: 10,
      padding: 10,
      marginTop: 5,
      marginLeft: 20,
      borderRadius: 15,
      default: 'ios',
    },
    searchBarContainer: {
      backgroundColor: 'transparent', 
    },
  
});