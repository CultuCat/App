import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ScrollView,StatusBar, SafeAreaView, TouchableOpacity, Image, Modal} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import Chip from '../components/chip.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Page() {
  const Item = ({ title, ubicacion, data, image, id }) => (

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
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  

  const handleOptionSelect = (index, value) => {
    setSelectedOption(value);
  };
  
  
  const loadMoreData = async () => {
    if (loading || !hasMoreData) return;
  
    try {
      setLoading(true);
      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const nextPage = page + 1; 
      const url = `https://cultucat.hemanuelpc.es/events/?page=${nextPage}&query=${search}&${tagsQueryString}`;
      console.log('URL de la solicitud:', url);
      const response = await fetch(url);
      const newData = await response.json();
  
      if (newData && newData.results && newData.results.length > 0) {
        setData((prevData) => [...prevData, ...newData.results]);
        setPage(nextPage); 
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




  useEffect(() => {
    const fetchTags = async () => {
      try {
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;
        const response = await fetch('https://cultucat.hemanuelpc.es/tags', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const tagsFromServer = await response.json();
          setTags(tagsFromServer);
        } else {
          throw new Error('Error en la solicitud');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTags();
  }, []);


  const handleAccept = async () => {
    try {
      const userTokenString = await AsyncStorage.getItem("@user");
      const userToken = JSON.parse(userTokenString).token;
  
      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      
      const response = await fetch(`https://cultucat.hemanuelpc.es/events/?query=${search}&${tagsQueryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${userToken}`, 
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const filteredEvents = await response.json();
        setData(filteredEvents.results);
      } else {
        console.error('Error en la solicitud GET:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
    }
  
    setModalVisible(false);
  };
  
  const handleOpenModal = () => {
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  const handleTagPress = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((selectedTag) => selectedTag !== tag)
        : [...prevTags, tag]
        
    );
  };  

  const handleSearch = async () => {
    try {
      const userTokenString = await AsyncStorage.getItem("@user");
      const userToken = JSON.parse(userTokenString).token;
      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const response = await fetch(`https://cultucat.hemanuelpc.es/events/?query=${search}&${tagsQueryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${userToken}`, 
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newData = await response.json();
        setData(newData.results);
        if (newData.results.length > 0) {
          setHasMoreData(true); 
        } else {
          setHasMoreData(false);
        }
        setPage(1)
      } else {
        console.error('Error en la solicitud GET:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>

      <SearchBar
        inputContainerStyle={styles.searchBarInputContainer}
        placeholder="Cerca..."
        onChangeText={(text) => setSearch(text)}
        value={search}
        platform="ios"
        containerStyle={styles.searchBarContainer}
        searchIcon={false}
      />
  <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <MaterialIcons name="search" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.filtersButton}>
        <MaterialIcons name="reorder" style={styles.filtersIcon} />
        <Text style={styles.filtersText}> Ordenar per ..</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.mapButton} onPress={handlePressMap}>
        <MaterialIcons name="location-on" style={styles.location} />
        <Text style={styles.mapText}> Veure mapa</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

      <TouchableOpacity style={styles.botoOrder} onPress={handleOpenModal}>
          <Chip text='Tags' color="#87ceec" />
          <Text style={styles.filtersText}> Filter by Tags</Text>
        </TouchableOpacity>
        <Modal
        visible={modalVisible}
        onBackdropPress={handleCloseModal}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.viewStyle}>
        <Text style={styles.titleText}>Escull els tags pels que vols filtrar</Text>
          <ScrollView style={styles.scrollStyle}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                onPress={() => handleTagPress(tag)}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  backgroundColor: selectedTags.includes(tag) ? '#ff6961' : 'white',
                }}
              >
                <Text>{tag.nom}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#87ceec' }]}
              onPress={handleAccept}
            >
              <Text style={{ color: 'black' }}>Acceptar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'transparent' }]}
              onPress={handleCloseModal}
            >
              <Text style={{ color: 'black' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
      </Modal>



        <TouchableOpacity style={styles.botoOrder2}>
          <Chip text='Preu' color="#87ceec" />
          <Text style={styles.filtersText}> Filter by Tags</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botoOrder2}>
          <Chip text='Data' color="#87ceec" />
          <Text style={styles.filtersText}> Filter by Tags</Text>
        </TouchableOpacity>
      </View>
      
   

      <FlatList
        data={data}
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
      marginTop: 20,
      marginLeft: 20,
      borderRadius: 15,
      default: 'ios',
    },
    searchBarContainer: {
      backgroundColor: 'transparent', 
    },
    botoOrder: {
      marginLeft:20,
      marginRight: -40,
    },
    botoOrder2: {
      marginLeft:6,
      marginRight: -40,
    },
    
    viewStyle: {
      marginTop:70,
    } ,
    scrollStyle: {
      marginBottom: 100,
    } ,
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: -100,
      backgroundColor: 'white', 
      padding: 15, 
      borderTopWidth: 1, 
      borderTopColor: 'white', 
    },
    
    button: {
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      width: '45%',
      alignItems: 'center',
      borderRadius: 10,
      borderColor: 'black'
    },
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
      marginLeft:10,
    },
    searchButton: {
      marginLeft: 270,
      marginTop:-50,
      marginBottom: 15
    }
    
  
});
