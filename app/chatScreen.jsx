import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Keyboard, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ChatScreen() {
  const route = useRoute();
  const { user, uId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const uIdR = user.id; //Remote user id
  const url = 'https://cultucat.hemanuelpc.es';
  const { t } = useTranslation();
  const navigation = useNavigation();

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

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []); 


  const sendMessage = async () => {
    try {
      const response = await fetch(`${url}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_from: uId,
          user_to: uIdR,
          text: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isSentByUser = item.user_from === uId;

    return (
      <View style={[styles.messageContainer, isSentByUser ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  const handleScreenTap = () => {
    Keyboard.dismiss();
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-20}
    >
      <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="ios-chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <Image source={{ uri: user.imatge }} style={styles.userImage} />
            <Text style={styles.userName}>{user.first_name} </Text>
          </View>
        </View>
        <View style={styles.messagesBox}>
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity
            onPress={handleScreenTap}
          >
          </TouchableOpacity>
        </View>
        <View style={styles.chatbox}>
          <TextInput
            multiline
            placeholder={t('Chat.Type_here')}
            style={styles.input}
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  chatbox: {
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: "#ff6961",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: 10,
    flex: 3,
    fontSize: 15,
    height: 40,
    alignSelf: "center",
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: "#c0c2c2",
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  messagesBox: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#87ceec',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCF8C5',
  },
  messageText: {
    fontSize: 16,
  },
});
