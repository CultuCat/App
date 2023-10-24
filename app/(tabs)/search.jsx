import React,  { useState }  from 'react';
import { Text, View, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';

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

  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('map');
  };

  state = {
    search: '',
  };
  const [search, setSearch] = useState('');
  const updateSearch = (text) => {
    setSearch(text); 
  };
   
    const DATA = [
      {
        id: '1',
        title: 'Barcelona Tech',
        data: 'dg, 22 octubre',
        ubicacion: 'Barcelona',
        image: require('../../assets/teatro.png')
      },
      {
        id: '2',
        title: 'Rooftop Party',
        data: 'dg, 22 octubre',
        ubicacion: 'Barcelona',
        image: require('../../assets/rooftop.png')
      },
      {
        id: '3',
        title: 'Fira Àpat',
        data: 'dg, 22 octubre',
        ubicacion: 'Tarragona',
        image: require('../../assets/rooftop.png')
      },
      {
        id: '4',
        title: 'Obra Romeu i Julieta',
        data: 'dg, 22 octubre',
        ubicacion: 'Reus',
        image: require('../../assets/teatro.png')
      }
    ];
  
 const filteredData = DATA.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <SafeAreaView style={styles.container}>
      
      <SearchBar
        inputContainerStyle={styles.searchBarInputContainer}
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        platform="ios"
        containerStyle={styles.searchBarContainer}
      />
       
      <TouchableOpacity style={styles.filtersButton}>
        <MaterialIcons
          name="filter-list"
          style={styles.filtersIcon}
        />
        <Text style={styles.filtersText}> Filters</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mapButton} onPress={handlePress}>
        <MaterialIcons
          name="location-on"
          style={styles.location}
        />
        <Text style={styles.mapText}> Veure mapa</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <Item title={item.title} data={item.data} ubicacion={item.ubicacion} image={item.image} />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
      marginTop: -39
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

