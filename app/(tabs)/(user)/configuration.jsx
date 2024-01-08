import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Modal, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import i18next, { languageResources } from '../../../languages/i18next';
import language_list from '../../../languages/language_list.json';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';


export default function Configuration() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleSec, setModalVisibleSec] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUserVisible, setIsUserVisible] = useState(null);
  const [UserWantsToTalk, setUserWantsToTalk] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language);
  const [open, setOpen] = useState(false);
  const [selectedLanguageName, setSelectedLanguageName] = useState(language_list[i18next.language].name);



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
      color: '#ff6961',
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
      marginLeft: 40,
      fontSize: 20,
      fontWeight: 'bold',
    },
    xatejar: {
      marginTop: 15,
      marginLeft: 40,
      fontSize: 20,
      fontWeight: 'bold',
    },
    globe: {
      marginLeft: 230,
      marginTop: -25,
    },
    eye: {
      marginLeft: 230,
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
    },
    languagesList: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 60,
      paddingHorizontal: 10,
      backgroundColor: '#ff6961',
    },
    languageButton: {
      padding: 10,
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
    },
    lngName: {
      fontSize: 18,
      color: 'white',
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
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;
        if (!data) {
          console.error('User data not found in AsyncStorage');
          return;
        }

        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${data}`,
          {
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
    return <Text>{t('Carregant')}</Text>;
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
  const saveconfig = async () => {
    try {
      const userId = user.id;
      const wantsToTalkUrl = `https://cultucat.hemanuelpc.es/users/${userId}/wants_to_talk_perfil/`;
      const isVisibleUrl = `https://cultucat.hemanuelpc.es/users/${userId}/is_visible_perfil/`;

      const wantsToTalkResponse = await fetch(wantsToTalkUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wantsToTalk: UserWantsToTalk,
        }),
      });

      const isVisibleResponse = await fetch(isVisibleUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: isUserVisible,
        }),
      });

      if (!wantsToTalkResponse.ok || !isVisibleResponse.ok) {
        const errorWantsToTalk = await wantsToTalkResponse.json();
        const errorIsVisible = await isVisibleResponse.json();
        throw new Error(`Error in saveconfig requests: ${JSON.stringify(errorWantsToTalk)}, ${JSON.stringify(errorIsVisible)}`);
      }

      Alert.alert('Dades guardades', 'Les teves dades estan guardades correctement');
    } catch (error) {
      console.error('Error in saveconfig:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const userId = user.id;
      const apiUrl = `https://cultucat.hemanuelpc.es/users/${userId}`;
      await AsyncStorage.removeItem("@user");
      toggleModalSec();

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Error en la solicitud DELETE al backend: ${JSON.stringify(errorResponse)}`);
      }
      navigation.navigate('index');

    } catch (error) {
      console.error('Error al eliminar el usuario en el backend:', error);
    }
  };

  const changeLng = lng => {
    i18next.changeLanguage(lng);
    setSelectedLanguage(lng);
    setSelectedLanguageName(language_list[lng].name);
    //PUT
    saveUserLanguage(lng);
  };

  const saveUserLanguage = async (lng) => {
    try {
      const userId = user.id;
      const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userId}/language/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: lng,
        }),
      });

      if (!response.ok) {
        const errorlang = await response.json();
        throw new Error(`Error in save language request: ${JSON.stringify(errorlang)}`);
      }

    } catch (error) {
      console.error('Error updating user language:', error);
    }
  };

  const dropdownItems = Object.keys(languageResources).filter((key) => key !== selectedLanguage).map((key) => ({
    label: language_list[key].name,
    value: key,
  }));


  return (
    <View style={styles.containerTot}>
      <Ionicons style={styles.eye} name="eye" size={25} color="#ff6961" />
      <Text style={styles.visibilitat}>{t('Config.Visibilitat')}</Text>
      <View style={styles.separator2} />
      <TouchableOpacity onPress={toggleUserVisibility} style={styles.switchContainer}>
        <Text style={styles.toggleText}>{isUserVisible ? t('Config.User_vis') : t('Config.User_no_vis')}</Text>
        <Switch
          style={styles.switchStyle}
          trackColor={{ false: "#767577", true: "#ff6961" }}
          thumbColor={"white"}
          ios_backgroundColor="#3e3e3e"
          value={isUserVisible}
          onValueChange={toggleUserVisibility}
        />
      </TouchableOpacity>
      <View style={styles.separator2} />
      <Text style={styles.xatejar}>{t('Config.Xat')}</Text>
      <Ionicons style={styles.chat} name="person" size={25} color="#ff6961" />
      <View style={styles.separator2} />
      <TouchableOpacity onPress={toggleUserWantsToTalk} style={styles.switchContainer}>
        <Text style={styles.toggleText}>{UserWantsToTalk ? t('Config.User_xat') : t('Config.User_no_xat')}</Text>
        <Switch
          style={styles.switchStyle}
          trackColor={{ false: "#767577", true: "#ff6961" }}
          thumbColor={"white"}
          ios_backgroundColor="#3e3e3e"
          value={UserWantsToTalk}
          onValueChange={toggleUserWantsToTalk}
        />
      </TouchableOpacity>
      <View style={styles.separator2} />
      <Text style={styles.xatejar}>{t('Config.Idioma')}</Text>
      <Ionicons style={styles.globe} name="globe-sharp" size={25} color="#ff6961" />
      <View style={styles.separator2} />
      <View style={{ marginVertical: '3%', marginHorizontal: '20%', zIndex: '100', alignItems: 'center' }}>
          <DropDownPicker
            defaultValue={selectedLanguage}
            style={{ backgroundColor: '#ff6961'}}
            onSelectItem={(item) => {
              changeLng(item.value);
            }}
            open={open}
            items={dropdownItems}
            setOpen={setOpen}
            placeholder={`${selectedLanguageName}`}
          />
      </View>

      <View style={styles.separator2} />
      <Text style={styles.xatejar}> {t('Config.Eliminar')}</Text>
      <View style={styles.separator2} />
      <TouchableOpacity style={styles.deleteAcc} onPress={toggleModalSec}>
        <Text style={styles.compte}>{t('Config.Eliminar')}</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisibleSec} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{t('Config.Confirmation')}</Text>
            <Button title={t('Config.Si')} onPress={handleDelete} />
            <Button title={t('Config.No')} onPress={toggleModalSec} />
          </View>
        </View>
      </Modal>
      <View style={styles.separator2} />
      <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
        <Text style={styles.sessio}>{t('Config.Sessio')}</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{t('Config.Confirmation_ses')}</Text>
            <Button title={t('Config.Si')} onPress={handleLogout} />
            <Button title={t('Config.No')} onPress={toggleModal} />
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.saveButton} onPress={saveconfig}>
        <Text style={styles.sessio}>{t('Config.Desar')}</Text>
      </TouchableOpacity>
    </View>
  );
}
