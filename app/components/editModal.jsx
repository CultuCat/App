import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, TextInput, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../constants/colors';


const EditModal = ({
  userId,
  editVisible,
  setEditVisible,
}) => {
  const [first_name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTokenString = await AsyncStorage.getItem("@user");
        if (!userTokenString) {
          console.error('User token not found in AsyncStorage');
          return;
        }

        const userToken = JSON.parse(userTokenString).token;
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userId}`, {
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }

        const userData = await response.json();
        setUser(userData);
        setBio(userData.bio);
        setName(userData.first_name);
        setUsername(userData.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [Platform === 'ios' && user]);

  if (!user) {
    return <Text>{t('Carregant')}</Text>;
  }

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Se requiere permiso para acceder a la galería de fotos.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.canceled) {
      return;
    }

    setUser((prevUser) => ({
      ...prevUser,
      imatge: pickerResult.assets[0].uri,
    }));
  };
  const handleSaveChanges = async () => {
    try {
      const userTokenString = await AsyncStorage.getItem("@user");
      if (!userTokenString) {
        console.error('User token not found in AsyncStorage');
        return;
      }

      const userToken = JSON.parse(userTokenString).token;

      const updatedProfile = new FormData();

      updatedProfile.append('first_name', first_name || user.first_name);
      updatedProfile.append('bio', bio || user.bio);
      updatedProfile.append('username', username || user.username);
      if (user.imatge) {
        const uri = Platform.OS === 'android' ? user.imatge : user.imatge.replace('file://', '');
        updatedProfile.append('imatge', { uri, name: `${user.id}.png`, type: 'image/png' });
      }

      const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: updatedProfile,
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const updatedUserData = await response.json();
      setUser(updatedUserData);
      closeModal();
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const closeModal = () => {
    setEditVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={editVisible}
      onRequestClose={closeModal}
    >
      <View style={[styles.modalContainer, Platform.OS === 'android' && { marginTop: '0' }]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1%'
        }}>
          <Text style={styles.title}>Edit</Text>
          <TouchableOpacity style={styles.iconContainer} onPress={closeModal}>
            <Ionicons name="ios-close-outline" size={36} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={{
            alignItems: 'center',
          }}>
            <TouchableOpacity onPress={handleSelectImage}>
              <Image
                style={styles.fotoProfile}
                source={{
                  uri:
                    user.imatge,
                }}
              />
              <MaterialIcons
                style={styles.camera}
                name="photo-camera"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>{t('Edit_User.Username')}:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <Text style={styles.username}>{t('Edit_User.Nom')}:</Text>
          <TextInput
            style={styles.input}
            value={first_name}
            onChangeText={text => setName(text)}
          />
          <Text style={styles.genere}>{t('Edit_User.Bio')}:</Text>
          <TextInput
            multiline={true}
            style={styles.textarea}
            value={bio}
            onChangeText={text => setBio(text)}
          />
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.rankingText}>{t('Edit_User.Desar_can')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 60,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  modalContent: {
    backgroundColor: 'white',
    flex: 1,
  },
  fotoProfile: {
    borderRadius: 80,
    width: 140,
    height: 140,
  },
  camera: {
    fontSize: 30,
    color: 'black',
    marginTop: -26,
    marginLeft: 100,
  },
  input: {
    height: 40,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: colors.primary,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  textarea: {
    height: 100,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: colors.primary,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  genere: {
    fontWeight: 'bold',
  },
  cancelButton: {
    width: 130,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: '5%'
  },
  saveButton: {
    width: 130,
    height: 40,
    backgroundColor: '#ff6961',
    borderWidth: 1,
    borderColor: '#ff6961',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: '5%'
  },
  icon: {
    marginTop: 15,
    marginLeft: 10,

  },
});

export default EditModal;
