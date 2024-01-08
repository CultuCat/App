import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Modal, TouchableOpacity, Switch, Alert, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import i18next, { languageResources } from '../../languages/i18next';
import language_list from '../../languages/language_list.json';
import { useTranslation } from 'react-i18next';
import colors from '../../constants/colors';
import Divider from './divider';
import DropDownPicker from 'react-native-dropdown-picker';


const ConfigModal = ({
  userId,
  configVisible,
  setConfigVisible,
}) => {
  const [loading, setLoading] = useState(true);
  const [isUserPrivate, setIsUserPrivate] = useState(null);
  const [UserWantsToTalk, setUserWantsToTalk] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language);
  const [open, setOpen] = useState(false);
  const [selectedLanguageName, setSelectedLanguageName] = useState(language_list[i18next.language].name);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const getToken = async () => {
    const userTokenString = await AsyncStorage.getItem("@user");
    const userToken = JSON.parse(userTokenString).token;
    setToken(userToken);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userId}`,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const userData = await response.json();
      setUser(userData);
      setIsUserPrivate(!userData.isVisible);
      setUserWantsToTalk(userData.wantsToTalk);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
    fetchData();
  }, []);

  const handleLogout = async () => {
    closeModal();
    await AsyncStorage.removeItem("@user");
    navigation.replace('index');
  };

  const profilePrivacy = async () => {
    await fetch(`https://cultucat.hemanuelpc.es/users/${userId}/is_visible_perfil/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        isVisible: isUserPrivate,
      }),
    });
    setIsUserPrivate(!isUserPrivate);
  };

  const wantsToTalk = async () => {
    await fetch(`https://cultucat.hemanuelpc.es/users/${userId}/wants_to_talk_perfil/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        wantsToTalk: !UserWantsToTalk,
      }),
    });
    setUserWantsToTalk(!UserWantsToTalk);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = `https://cultucat.hemanuelpc.es/users/${userId}`;
      await AsyncStorage.removeItem("@user");

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Error en la solicitud DELETE al backend: ${JSON.stringify(errorResponse)}`);
      }
      closeModal();
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

  const dropdownItems = Object.keys(languageResources).filter((key) => key !== selectedLanguage).map((key) => ({
    label: language_list[key].name,
    value: key,
  }));

  const saveUserLanguage = async (lng) => {
    try {
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

  const deleteAlert = () => {
    Alert.alert(
      t('Config.Confirmation'),
      '',
      [
        { text: t('Config.Si'), onPress: handleDelete },
        { text: t('Config.No') },
      ],
      { cancelable: false }
    );
  };

  const logoutAlert = () => {
    Alert.alert(
      t('Config.Confirmation_ses'),
      '',
      [
        { text: t('Config.Si'), onPress: handleLogout },
        { text: t('Config.No') },
      ],
      { cancelable: false }
    );
  };

  const closeModal = () => {
    setConfigVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={configVisible}
      onRequestClose={closeModal}
      style={{ height: '50%' }}
    >
      <View style={[styles.modalContainer, Platform.OS === 'android' && { marginTop: '0' }]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1%'
        }}>
          <Text style={styles.title}>{t('Config.Config')}</Text>
          <TouchableOpacity style={styles.iconContainer} onPress={closeModal}>
            <Ionicons name="ios-close-outline" size={36} color="black" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.modalContent}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 20,
            }}>
              <Text style={styles.subtitle}>{t('Config.Idioma')}</Text>
              <Ionicons name="globe-sharp" size={25} color="#ff6961" />
            </View>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              zIndex: 2,
              marginHorizontal: '25%',
            }}>
              <DropDownPicker
                defaultValue={selectedLanguage}
                style={{ borderRadius: 5 }}
                onSelectItem={(item) => {
                  changeLng(item.value);
                }}
                open={open}
                items={dropdownItems}
                setOpen={setOpen}
                placeholder={`${selectedLanguageName}`}
              />
            </View>
            <Divider />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 20,
              marginTop: 10,
            }}>
              <Text style={styles.subtitle}>{t('Config.Permissions')}</Text>
              <Ionicons name="person" size={25} color="#ff6961" />
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 10,
            }}>
              <Text style={{ marginRight: 16 }}>{t('Config.Visibilitat')}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#ff6961" }}
                thumbColor={"white"}
                ios_backgroundColor="#3e3e3e"
                value={isUserPrivate}
                onValueChange={profilePrivacy}
              />
              <Text style={{ marginLeft: 5, opacity: 0.5 }}>{isUserPrivate ? t('Config.User_no_vis') : t('Config.User_vis')}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 10,
            }}>
              <Text style={{ marginRight: 10 }}>{t('Config.Xat')}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#ff6961" }}
                thumbColor={"white"}
                ios_backgroundColor="#3e3e3e"
                value={UserWantsToTalk}
                onValueChange={wantsToTalk}
              />
              <Text style={{ marginLeft: 5, opacity: 0.5  }}>{UserWantsToTalk ? t('Config.User_xat') : t('Config.User_no_xat')}</Text>
            </View>
            <Divider />
            <Text style={[styles.subtitle, { marginBottom: 20, marginTop: 10 }]}> {t('Config.Eliminar')}</Text>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#ff6961' }]} onPress={deleteAlert}>
                <Text>{t('Config.Eliminar')}</Text>
              </TouchableOpacity>
            </View>
            <Divider />
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
              <TouchableOpacity style={styles.button} onPress={logoutAlert}>
                <Text>{t('Config.Sessio')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    width: 170,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff6961',
  },
});

export default ConfigModal;
