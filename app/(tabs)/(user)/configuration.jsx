import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

export default function Page() {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    editButton: {
      width: 130,
      height: 40,
      backgroundColor: 'transparent',
      color: 'red', 
      borderWidth: 1,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      marginLeft: 220,
      marginTop: 500,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    sessio: {
      color:'#ff6961',
    },
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogout = () => {
    toggleModal();
    async()=> await AsyncStorage.removeItem("@user")
    navigation.navigate('index');
  };

  return (
    <View>
      <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
        <Text style={styles.sessio}>Tancar sessió</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Estàs segur que vols tancar la sessió?</Text>
            <Button title="Si" onPress={handleLogout} />
            <Button title="Cancelar" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
