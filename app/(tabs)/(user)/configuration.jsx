import React, { useState, useEffect} from 'react';
import { View, Button, StyleSheet, Text, Modal, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Configuration() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleSec, setModalVisibleSec] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUserVisible, setIsUserVisible] = useState(null);
  const [UserWantsToTalk, setUserWantsToTalk] = useState(null);
  


  const styles = StyleSheet.create({
    containerTot: {
      backgroundColor: 'white',
      flex: 1,
      
    },
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
      marginLeft: 210,
      marginTop: 40,
    },
    saveButton: {
      width: 130,
      height: 40,
      backgroundColor: 'transparent',
      color: 'red', 
      borderWidth: 1,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      marginLeft: 40,
      marginTop: -40,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#E7E7E7',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    sessio: {
      color:'#ff6961',
    },
    
    toggleText: {
      marginLeft: 60,
      marginTop: 3,

    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30,
    },
    switchStyle: {
      marginLeft: 90,
    },
    separator2: {
      height: 1,
      backgroundColor: 'black', 
      width: 300,
      alignSelf: 'center',
      marginTop: 20,
    },
    visibilitat: {
      marginTop: -25,
      marginLeft: 10,
      fontSize: 20,
      fontWeight: 'bold',
    },
    xatejar: {
      marginTop: 15,
      marginLeft: 10,
      fontSize: 20,
      fontWeight: 'bold',
    },
    eye: {
      marginLeft: 200,
      marginTop: 30,
    },
    chat: {
      marginLeft: 230,
      marginTop: -25,
    },
    deleteAcc: {
      width: 170,
      height: 40,
      backgroundColor: 'transparent',
      color: 'red',
      borderWidth: 1,
      borderColor: 'coral',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      marginLeft: 100,
      marginTop: 20,
    }
      
  });
  const getLocalUser = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;
      const data = JSON.parse(dataString);
      return data.user.id;
    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLocalUser();
        if (!data) {
          console.error('User data not found in AsyncStorage');
          return;
        }
  
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${data}`);
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
  
        const userData = await response.json();
        setUser(userData);
  
        setIsUserVisible(userData.isVisible || false);
        setUserWantsToTalk(userData.wantsToTalk || false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  if (loading) {
    return <Text>Cargando...</Text>; 
  }
  


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalSec = () => {
    setModalVisibleSec(!isModalVisibleSec);
  };

  const handleLogout = async () => {
    toggleModal();
    await AsyncStorage.removeItem("@user");
    navigation.replace('index');
  };
  const toggleUserVisibility = () => {
    setIsUserVisible(!isUserVisible);
  };
  const toggleUserWantsToTalk = () => {
    setUserWantsToTalk(!UserWantsToTalk);
  };

  return (
    <View style={styles.containerTot}>
      <Ionicons style={styles.eye} name="eye" size={25} color="#ff6961" />
    <Text style={styles.visibilitat}> Visibilitat Usuari </Text>
    <View style={styles.separator2}/>
    <TouchableOpacity onPress={toggleUserVisibility} style={styles.switchContainer}>
    <Text style={styles.toggleText}>{isUserVisible ? 'Usuari Visible' : 'Usuari Ocult'}</Text>
      <Switch
      style = {styles.switchStyle}
      trackColor={{ false: "#767577", true: "#ff6961" }}
      thumbColor={"white"}
      ios_backgroundColor="#3e3e3e"
      value={isUserVisible}
      onValueChange={toggleUserVisibility}
      />
      </TouchableOpacity>
      <View style={styles.separator2}/>
      <Text style={styles.xatejar}> Xatejar amb usuaris</Text>
      <Ionicons style={styles.chat} name="person" size={25} color="#ff6961" />
      <View style={styles.separator2}/>
      <TouchableOpacity onPress={toggleUserWantsToTalk } style={styles.switchContainer}>
    <Text style={styles.toggleText}>{UserWantsToTalk ? 'Usuari vol xatejar' : 'Usuari no vol xatejar'}</Text>
      <Switch
      style = {styles.switchStyle}
      trackColor={{ false: "#767577", true: "#ff6961" }}
      thumbColor={"white"}
      ios_backgroundColor="#3e3e3e"
      value={UserWantsToTalk}
      onValueChange={toggleUserWantsToTalk}
      />
      </TouchableOpacity>
      <View style={styles.separator2}/>
      <Text style={styles.xatejar}> Eliminar compte</Text>
      <View style={styles.separator2}/>
      <TouchableOpacity style={styles.deleteAcc} onPress={toggleModalSec}>
      <Text style={styles.compte}>Eliminar Compte</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisibleSec} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Estàs segur que vols eliminar el compte ?</Text>
            <Button title="Si" onPress={handleLogout} />
            <Button title="Cancelar" onPress={toggleModalSec} />
          </View>
        </View>
      </Modal>
      <View style={styles.separator2}/>
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
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.sessio}>Desar</Text>
      </TouchableOpacity>
    </View>
  );
}
