import React,  { useState }  from 'react';
import { Text, View, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { SearchBar } from 'react-native-elements';

export default function Page() {

  const Item = ({ title, image }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={image} style={styles.image} />
      <View style={styles.itemText}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

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
        title: 'Avril Rubio',
        image: require('../../../assets/teatro.png')
      },
      {
        id: '2',
        title: 'Selena Gomez',
        image: require('../../../assets/rooftop.png')
      },
      {
        id: '3',
        title: 'Angelo Peluso',
        image: require('../../../assets/rooftop.png')
      },
      {
        id: '4',
        title: 'Taylor Swift',
        image: require('../../../assets/teatro.png')
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
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    marginTop: 14,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 40
  },
  itemText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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

