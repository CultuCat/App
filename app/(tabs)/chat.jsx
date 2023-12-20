import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import ChatScreen from '../components/chatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [visibleUser, setVisibleUser] = useState(false);
  const [uId, setUId] = useState(''); // Local user id
  const [friends, setFriends] = useState([]);
  const [uIdR, setUIdR] = useState(''); // Remote user id
  const [url, setUrl] = useState('https://cultucat.hemanuelpc.es');
  const { t } = useTranslation();

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
      try {
        const response = await fetch(`${url}/users/${uId}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFriends(data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [uId, url]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setVisibleUser(true)
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setVisibleUser(false);
  };


  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item)}>
      <View style={styles.userContainer}>
        <View style={styles.userCard}>
          <Image source={{ uri: item.imatge }} style={styles.userImage} />
          <Text style={styles.userName}>{item.first_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {visibleUser ? (
        <ChatScreen user={selectedUser} userLId={uId} onBack={handleBackToUsers} />
      ) : (
        <FlatList
          data={friends}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <Text style={styles.noAmics}>{t('Chat.Afegir_amic')}</Text>
          )}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
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



