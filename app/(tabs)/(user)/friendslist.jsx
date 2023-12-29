import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image, Button } from 'react-native';
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

  const ItemWithButtons = ({ id, title, image }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item}>
        <Image source={image} style={styles.image} />
        <View style={styles.itemText}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(id)}>
        <Text style={styles.buttonText}>✓</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleReject(id)}>
        <Text style={styles.buttonText}>✗</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
  


  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const updateSearch = (text) => {
    setSearch(text);
  };

  const [data, setData] = useState([]);
  const [pending, setPending] = useState([]); 
  const handleAccept = async (id) => {
    const rId = user.pending_friend_requests.find(request => request.from_user === id).id;
    const response = await fetch(`https://cultucat.hemanuelpc.es/users/${data.user.id}/accept_friend_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": rId,
        "is_accepted": "true",
      }),
    });
    if (!response.ok) {
      console.error('Error en la solicitud POST:', response);
    } else {
      const data = await response.json();
      console.log('Respuesta de la solicitud POST:', data);
    }
  };
  
  const handleReject = async (id) => {
    const rId = user.pending_friend_requests.find(request => request.from_user === id).id;
    const response = await fetch(`https://cultucat.hemanuelpc.es/users/${data.user.id}/accept_friend_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": rId,
        "is_accepted": "false",
      }),
    });
    if (!response.ok) {
      console.error('Error en la solicitud POST:', response);
    } else {
      const data = await response.json();
      console.log('Respuesta de la solicitud POST:', data);
    }
  };
  const getLocalUser = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;
      const data = JSON.parse(dataString);
      console.log('User', data.user); 
      const promises = data.user.pending_friend_requests.map((id) => fetchUserDetails(id.from_user));
      const userDetails = await Promise.all(promises);
      setPending(userDetails);
      return data.user; 

    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };

  const fetchUserDetails = async (id) => {
    const response = await fetch(`https://cultucat.hemanuelpc.es/users/${id}`);
    const data = await response.json();
    return data;
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
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userData.id}`, {
          method: 'GET',
          headers,
        });
        if (response.ok) {
          const responseData = await response.json();
          setUser(userData);
          setData(responseData.friends || []);
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
      <Text style={styles.title}>Friend requests</Text>
      <FlatList
        data={pending}
        renderItem={({ item }) => (
          <ItemWithButtons  id={item.id} title={item.username} image={{ uri: item.imatge}} />
        )}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.title}>Friends</Text>

      <FlatList
      style={styles.list}
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  container: {
   //flex: 1,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  acceptButton: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    marginTop: 14,
    flex:1,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 40
  },
  itemText: {
    //flex: 1,
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
  list: {
    marginTop:60,
  }
 
});
