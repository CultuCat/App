import { useState, useEffect } from 'react';
import { View, Text,StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const ChatScreen = ({ user, userLId, onBack}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const uId = userLId; //Local user id
  const uIdR = user.id; //Remote user id
  const [url, setUrl] = useState('https://cultucat.hemanuelpc.es');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${url}/messages/?user1=${uId}&user2=${uIdR}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [uId, uIdR, url]);
  
  return (
    <Modal
      animationType="none"
      onRequestClose={onBack}
    >
      <View style={styles.container}>
          <View style={styles.userInfo}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                  <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
              <View style={styles.userDetails}>
                  <Image source={{ uri: user.imatge }} style={styles.userImage} />
                  <Text style={styles.userName}>{user.first_name} </Text>
              </View>
        </View>
      </View>
       
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfo: {
      flexDirection: 'row',
      backgroundColor: '#ff6961',
      alignItems: 'center',
      padding: 10,
      paddingTop: 50,
    },
    userDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    userImage: {
      width: 60,
      height: 60,
      borderRadius: 60 / 2,
      marginRight: 14,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFF',
    },
    backButton: {
      marginRight: 20,
    },
});

export default ChatScreen;
