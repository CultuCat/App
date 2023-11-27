import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
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

  const [search, setSearch] = useState('');
  const updateSearch = (text) => {
    setSearch(text);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://10.0.2.2:8000/users/', {
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
        setData(dataFromServer);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredData = data.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );
  
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
          <Item title={item.username} image={{ uri: item.imatge}} />
        )}
        keyExtractor={(item) => item.id}
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
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 40
  },
  itemText: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    marginTop: 7,
    marginLeft: 10,
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
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
  },
});
