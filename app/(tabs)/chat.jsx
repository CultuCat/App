import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Divider from '../components/divider';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';


const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [uId, setUId] = useState(''); // Local user id
  const [friends, setFriends] = useState([]);
  const [loading, setloading] = useState(false);
  const url = 'https://cultucat.hemanuelpc.es';
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    const getLocalUser = async () => {
      try {
        const dataString = await AsyncStorage.getItem("@user");
        if (!dataString) return null;
        const data = JSON.parse(dataString);
        setUId(data.user.id)
      } catch (error) {
        console.error('Error getting local user data:', error);
        return null;
      }
    };
    getLocalUser();
  }, []);


  useEffect(() => {
    const fetchFriends = async () => {
      setloading(true);
      try {
        const response = await fetch(`${url}/users/${uId}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFriends(data.friends);
        setloading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [uId, url]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    navigation.navigate('chatScreen', { user, uId })
  };


  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item)}>
      <View style={styles.userContainer}>
        <View style={styles.userCard}>
          <Image source={{ uri: item.imatge }} style={styles.userImage} />
          <Text style={styles.userName}>{item.first_name}</Text>
        </View>
      </View>
      <Divider />
    </TouchableOpacity>
  );

  const filteredFriends = friends?.filter((item) => item.isVisible && !item.isBlocked && item.wantsToTalk);

  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <Text style={styles.title}>{t('Chat.Chat')}</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={filteredFriends}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              () => (
                <Text style={styles.noAmics}>{t('Chat.Afegir_amic')}</Text>
              )
            }
          />
        )}
      </SafeAreaView>
    </View>
  )
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
    marginVertical: 10,
    marginHorizontal: '5%',
  },
  userContainer: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    backgroundColor: '#FFFF',
    padding: 8,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginRight: 14,
    marginLeft: 6
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6961'
  },
  noAmics: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 18,
    paddingTop: 20
  }
});


export default Chat;



