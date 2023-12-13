import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import ChatScreen from '../components/chatScreen';


export default function Page() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [visibleUser, setVisibleUser] = useState(false);

  const contacts = [
    {
      uid: 1,
      name: 'Hitesh Choudhary',
      imageUrl: 'https://avatars.githubusercontent.com/u/11613311?v=4',
    },
    {
      uid: 2,
      name: 'Anurag Tiwari',
      imageUrl: 'https://avatars.githubusercontent.com/u/94738352?v=4',
    },
    {
      uid: 3,
      name: 'Sanket Singh',
      imageUrl: 'https://avatars.githubusercontent.com/u/29747452?v=4',
    },
    {
      uid: 4,
      name: 'Anirudh Jwala',
      imageUrl: 'https://avatars.githubusercontent.com/u/25549847?v=4',
    },
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setVisibleUser(true)
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setVisibleUser(false)
  };


  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item)}>
      <View style={styles.userContainer}>
        <View style={styles.userCard}>
          <Image source={{ uri: item.imageUrl }} style={styles.userImage} />
          <Text style={styles.userName}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {visibleUser ? (
        <ChatScreen user={selectedUser} onBack={handleBackToUsers} />
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.uid.toString()}
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
});





