import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendStatusIcon = ({ id }) => {
  const [friendStatus, setFriendStatus] = useState(null);

  useEffect(() => {
    const fetchFriendStatus = async () => {
      const status = await checkFriendStatus(id);
      setFriendStatus(status);
    };

    fetchFriendStatus();
  }, [id]);

  const onIconClick = async () => { 
    const userString = await AsyncStorage.getItem("@user");
    if (!userString) {
      console.error('User token not found in AsyncStorage');
      return;
    }
    const userID = JSON.parse(userString).user.id;
    const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userID}/send_friend_request/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "to_user": id,
      }),
    });

    if (!response.ok) {
      console.error('Error en la solicitud POST:', response);
    } else {
      const data = await response.json();
      setFriendStatus('requestSent');
    }
  };

  const checkFriendStatus = async (friendId) => {
    try {
      const userString = await AsyncStorage.getItem("@user");
      if (!userString) {
        console.error('User token not found in AsyncStorage');
        return;
      }
      const userToken = JSON.parse(userString).token;
      const id = JSON.parse(userString).user.id;
      const response = await fetch(`https://cultucat.hemanuelpc.es/users/${id}`, {
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const data = await response.json();
      if (data.friends.some(friend => friend.id === friendId)) {
        return 'isFriend';
      } else if (data.pending_friend_requests_sent.some(request => request.to_user.id === friendId)||data.pending_friend_requests.some(request => request.from_user.id === friendId)) {
        return'requestSent';
      }
      return 'notFriend';

    } catch (error) {
      console.error('Error fetching friend status:', error);
    }
  };

  return (
    <TouchableOpacity
      style={{ marginRight: 20 }}
      onPress={() => {
        if (friendStatus === 'notFriend') {
          onIconClick();
        }
      }}
    >
      {friendStatus === 'isFriend' ? (
        <MaterialCommunityIcons name="heart" size={24} color="black" />
      ) : friendStatus === 'requestSent' ? (
        <MaterialCommunityIcons name="account-clock-outline" size={24} color="black" />
      ) : (
        <Ionicons name="person-add" size={24} color="black" />
      )}
    </TouchableOpacity>
  );
};

export default FriendStatusIcon;