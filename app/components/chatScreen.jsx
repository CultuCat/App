import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const ChatScreen = ({ user, onBack}) => {
  

  return (
    <View style={styles.container}>
        <View style={styles.userInfo}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            <View style={styles.userDetails}>
                <Image source={{ uri: user.imageUrl }} style={styles.userImage} />
                <Text style={styles.userName}>{user.name} </Text>
            </View>
      </View>
    </View>
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
