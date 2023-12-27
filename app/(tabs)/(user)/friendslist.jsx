import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';


export default function Page() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const handlePress = (friendId) => {
    console.log(friendId);
    navigation.navigate('profilefriend', { id: friendId });
  };
  

 
  const Item = ({ id, username, image }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(id)}>
      <Image source={{ uri: image.uri }} style={styles.image} />

      <View style={styles.itemText}>
        <Text style={styles.title}>{username}</Text>
      </View>
    </TouchableOpacity>
  );
    

  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const updateSearch = (text) => {
    setSearch(text);
  };

  const [data, setData] = useState([]);

  const getLocalUser = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;
      const data = JSON.parse(dataString);
      return data.user;
    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getLocalUser();
        if (!userData) {
          console.error('User data not found in AsyncStorage');
          return;
        }

        const userString = await AsyncStorage.getItem("@user");
        const token = JSON.parse(userString).token; 

        const headers = {
          'Authorization': `Token ${token}`,
        };
        console.log(userData.id)
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userData.id}`, {
          method: 'GET',
          headers,
        });
        if (response.ok) {
          const responseData = await response.json();
          setUser(userData);
          setData(responseData.friends || []);
          console.log(responseData.friends[0].imatge);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const filteredData = data.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        inputContainerStyle={styles.searchBarInputContainer}
        placeholder={t('Friendlist.Busca')}
        onChangeText={updateSearch}
        value={search}
        platform="ios"
        containerStyle={styles.searchBarContainer}
      />
      <FlatList
      data={filteredData}
      renderItem={({ item }) => (
        <Item id={item.id} username={item.username} image={{ uri: item.imatge }} />
      )}
      keyExtractor={(item) => item.id.toString()}
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
