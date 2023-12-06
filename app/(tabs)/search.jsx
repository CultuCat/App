import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import Chip from '../components/chip.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDropdown from 'react-native-modal-dropdown';

export default function Page() {
  const Item = ({ title, ubicacion, data, image, id}) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePressEvent(id)}>
      {image ? (
      <Image source={{ uri: image.uri }} style={styles.image} />
    ) : (
      <Image
        source={{
          uri:
            'https://th.bing.com/th/id/R.78f9298564b10c30b16684861515c670?rik=zpQaqTcSRIc4jA&pid=ImgRaw&r=0',
        }}
        style={styles.image}
      />
    )}
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
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Esdeveniments'); 
  const options = [
    'Ascendent',
    'Descendent',
  ];

  const handleOptionSelect = (index, value) => {
    setSelectedOption(value);
  };
  

const loadMoreData = async () => {
  if (loading || !hasMoreData) return;

  try {
    setLoading(true);
    const response = await fetch(`https://cultucat.hemanuelpc.es/events/?page=${page + 1}`);
    const newData = await response.json();

    if (newData.results.length > 0) {
      setData((prevData) => [...prevData, ...newData.results]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMoreData(false);
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
  
  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };

  state = {
    search: '',
  };

  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;
  
        const response = await fetch('https://cultucat.hemanuelpc.es/events/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const dataFromServer = await response.json();
          setData(dataFromServer.results);
        } else {
          throw new Error('Error en la solicitud');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        inputContainerStyle={styles.searchBarInputContainer}
        placeholder="Cerca..."
        onChangeText={(text) => setSearch(text)}
        value={search}
        platform="ios"
        containerStyle={styles.searchBarContainer}
      />

      <TouchableOpacity style={styles.filtersButton}>
        <MaterialIcons name="filter-list" style={styles.filtersIcon} />
        <Text style={styles.filtersText}> Filter by Tags</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.mapButton} onPress={handlePressMap}>
        <MaterialIcons name="location-on" style={styles.location} />
        <Text style={styles.mapText}> Veure mapa</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      
      <ModalDropdown
        style={{
          backgroundColor: "#d2d0d0",
          marginTop: 0,
          alignSelf: 'flex-start',
          borderRadius: 100,
          flexDirection: 'row',
          paddingVertical: 5,
          width: 90,
          height: 28,
          fontSize:50,
          paddingHorizontal: 10,
          marginLeft:20,
          fontSize:10,
        }}
        options={options}
        defaultValue="Escdeveniment"
        onSelect={handleOptionSelect}
        dropdownStyle={styles.dropdownOptions} 
        textStyle= {styles.dropdownText2}  
        dropdownTextStyle={styles.dropdownText}   
        dropdownTextHighlightStyle={styles.dropdownTextHighlight} 
        saveScrollPosition={false}   
        
    />

        <TouchableOpacity style={styles.botoOrder2}>
          <Chip text='Data' color="#d2d0d0" />
          <Text style={styles.filtersText}> Filter by Tags</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botoOrder2}>
          <Chip text='Espai' color="#d2d0d0" />
          <Text style={styles.filtersText}> Filter by Tags</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botoOrder2}>
          <Chip text='Preu' color="#d2d0d0" />
          <Text style={styles.filtersText}> Filter by Tags</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item, index }) => (
          <Item
            title={item.nom}
            data={item.dataIni}
            ubicacion={item.espai.nom}
            image={item.imatges_list && item.imatges_list.length > 0 ? { uri: item.imatges_list[0] } : null}
            id={item.id}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
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
    width: 150,
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
      marginLeft: 185,
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
    botoOrder: {
      marginLeft:20,
    },
    botoOrder2: {
      marginLeft:6,
      marginRight: -40,
    },
    
    dropdownOptions: {
      width: 120,
    },
    dropdownText: {
      fontSize: 16,
      padding: 10,
    },
    dropdownTextHighlight: {
      color: 'white',
      backgroundColor: 'gray',
    },
    dropdownText2: {
      fontSize: 14, 
    },
  
});
