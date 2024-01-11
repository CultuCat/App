import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import UserPreview from '../../components/userPreview';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';


const ItemWithButtons = ({ user, id, username, name, image }) => {
  const navigation = useNavigation();

  const getLocalUser = async () => {
    try {
      const userString = await AsyncStorage.getItem("@user");
      if (!userString) {
        console.error('User token not found in AsyncStorage');
        return;
      }
      const userJSON = JSON.parse(userString).user;
      const userID = userJSON.id;
      const userToken = JSON.parse(userString).token;
      const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userID}`, {
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const userData = await response.json();
      return userData;

    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };
  
  const handlePress = (friendId) => {
    navigation.navigate('profilefriend', { id: friendId });
  };

  const handleAccept = async (id) => {
    const rId = user.pending_friend_requests.find(request => request.from_user.id === id).id;
    const response = await fetch(`https://cultucat.hemanuelpc.es/users/${user.id}/accept_friend_request/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": rId,
        "is_accepted": true,
      }),
    });
    if (!response.ok) {
      console.error('Error en la solicitud POST:', response);
    } else {
      const data = await response.json();
      const userData = await getLocalUser();
      setUser(userData);
    }
  };

  const handleReject = async (id) => {
    const rId = user.pending_friend_requests.find(request => request.from_user.id === id).id;
    const response = await fetch(`https://cultucat.hemanuelpc.es/users/${user.id}/accept_friend_request/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": rId,
        "is_accepted": false,
      }),
    });
    if (!response.ok) {
      console.error('Error en la solicitud POST:', response);
    } else {
      const data = await response.json();
      const userData = await getLocalUser();
      setUser(userData);
    }
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.user} onPress={() => handlePress(id)}>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
        <View style={styles.itemText}>
          <Text style={styles.name}>{name}</Text>
          <Text>{username}</Text>
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
};

export default function Page() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const updateSearch = (text) => {
    setSearch(text);
  };
  const [data, setData] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setloading] = useState(true);

  const getLocalUser = async () => {
    try {
      const userString = await AsyncStorage.getItem("@user");
      if (!userString) {
        console.error('User token not found in AsyncStorage');
        return;
      }
      const userJSON = JSON.parse(userString).user;
      const userID = userJSON.id;
      const userToken = JSON.parse(userString).token;
      const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userID}`, {
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const userData = await response.json();
      return userData;

    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };

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
        const userDetails = userData.pending_friend_requests.map(request => request.from_user);
        setPending(userDetails);
        setUser(userData);
        setData(responseData.friends || []);
        setloading(false);
      } else {
        console.error('Error fetching user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    (item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.first_name.toLowerCase().includes(search.toLowerCase())) &&
    item.isVisible && !item.isBlocked
  );

  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <View style={{ marginHorizontal: '5%' }}>
          <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={() => navigation.goBack()}>
            <Ionicons name="ios-close-outline" size={36} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('User.Amics')}</Text>
        </View>
        <View style={{ marginHorizontal: '3%', marginBottom: '3%' }}>
          <SearchBar
            inputContainerStyle={styles.searchBarInputContainer}
            placeholder={t('Friendlist.Busca')}
            onChangeText={updateSearch}
            value={search}
            platform="ios"
          />
        </View>
        {pending.length > 0 && (
          <View style={{ flex: 0 }}>
            <FlatList
              data={pending}
              renderItem={({ item }) => (
                <ItemWithButtons user={user} id={item.id} image={item.imatge} name={item.first_name} username={item.username} />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <UserPreview id={item.id} image={item.imatge} name={item.first_name} username={item.username} />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchData} />
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  androidView: {
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  androidMarginTop: {
    marginTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
  },
  closeIcon: {
    top: 10,
    right: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
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
  searchBarInputContainer: {
    height: 30,
    borderWidth: 0,
    borderRadius: 10,
    default: 'ios',
  },
  user: {
    flex: 4,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 5,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 100,
  },
  itemText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
