import React from 'react';
import { Text, View, Button, StyleSheet, Image, TouchableOpacity, Alert, Modal, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import Chip from '../../components/chip.jsx';
import { ScrollView } from 'react-native';
import Divider from '../../components/divider';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RankingModal from '../../components/rankingModal.jsx';
import { useTranslation } from 'react-i18next';
import EditModal from '../../components/editModal.jsx';
import ConfigModal from '../../components/configModal.jsx';


const User = () => {
  const [user, setUser] = useState(null);
  const [selectedTrofeuIndex, setSelectedTrofeuIndex] = useState(null);
  const [trofeus, setTrofeus] = useState(null);
  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  const [selectedTagIndex, setSelectedTagIndex] = useState(null);
  const [rankingVisible, setRankingVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const handleRanking = () => {
    setRankingVisible(true);
  };

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleConfig = () => {
    setConfigVisible(true);
  };

  const handleChipPress = (index) => {
    setSelectedChipIndex(index);
    Alert.alert(
      t('User.Eliminar_lloc_fav'),
      t('User.Conf_lloc_fav'),
      [
        { text: t('Cancel'), onPress: () => setSelectedChipIndex(null), style: "cancel" },
        { text: t('Delete'), onPress: () => handleDeleteChip(index) },
      ]
    );
  };

  const handleTagPress = (tagId) => {
    setSelectedTagIndex(tagId);
    Alert.alert(
      t('User.Delete_tag'),
      t('User.Conf_delete_tag'),
      [
        { text: t('Cancel'), onPress: () => setSelectedTagIndex(null), style: "cancel" },
        { text: t('Delete'), onPress: () => handleDeleteTag(tagId) },
      ]
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setSelectedTrofeuIndex(null);
  };

  const handleDeleteChip = async (espaiId) => {
    const index = user.espais_preferits.findIndex((espai) => espai.id === espaiId);

    if (index !== -1) {
      const updatedEspais = [...user.espais_preferits];
      updatedEspais.splice(index, 1);

      try {
        const userId = user.id;
        const apiUrl = `https://cultucat.hemanuelpc.es/users/${userId}/espais_preferits/${espaiId}`;
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;

        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud DELETE al backend');
        }

        setUser((prevUser) => ({
          ...prevUser,
          espais_preferits: updatedEspais,
        }));

        setSelectedChipIndex(null);
        Alert.alert(t('User.Espai_delete'), t('User.Espai_delete_text'));
      } catch (error) {
        console.error('Error al eliminar el lloc preferit en el backend:', error);
      }
    }
  };

  const handleDeleteTag = async (tagId) => {
    const index = user.tags_preferits.findIndex((tag) => tag.id === tagId);

    if (index !== -1) {
      const updatedTags = [...user.tags_preferits];
      updatedTags.splice(index, 1);

      try {
        const userId = user.id;
        const apiUrl = `https://cultucat.hemanuelpc.es/users/${userId}/tags_preferits/${tagId}`;
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;


        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${userToken}`,
          },

        });

        if (!response.ok) {
          throw new Error('Error en la solicitud DELETE al backend');
        }

        setUser((prevUser) => ({
          ...prevUser,
          tags_preferits: updatedTags,
        }));

        setSelectedTagIndex(null);
        Alert.alert(t('User.Tag_delete'), t('User.Tag_delete_text'));
      } catch (error) {
        console.error('Error al eliminar el tag en el backend:', error);

      }
    }
  };
  const handleTrofeuPress = (index) => {
    setSelectedTrofeuIndex(index);
    setModalVisible(true);
  };

  const getTrofeuColor = (trofeu) => {
    switch (trofeu.level_achived_user) {
      case 1:
        return "#cd7f32";
      case 2:
        return "#bebebe";
      case 3:
        return "#ffd700";
      case -1:
        return "#d2d0d0";
    }
  };
  const getTrofeuIcon = (trofeu) => {
    switch (trofeu.nom) {
      case "Explorador cultural":
        return "trophy-award";
      case "Reviewer":
        return "trophy-outline";
      case "Xerraire":
        return "trophy-variant";
      case "Col·leccionista d'or":
        return "trophy";
      case "Popular":
        return "trophy-variant-outline";
      default:
        return "trophy-award";
    }
  };


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await getLocalUser();
        if (!userID) {
          console.error('User ID not found in AsyncStorage');
          return;
        }


        const userTokenString = await AsyncStorage.getItem("@user");
        if (!userTokenString) {
          console.error('User token not found in AsyncStorage');
          return;
        }

        const userToken = JSON.parse(userTokenString).token;
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userID}`, {
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [Platform === 'ios' && user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;

        const response = await fetch('https://cultucat.hemanuelpc.es/trophies/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const dataFromServer = await response.json();
          setTrofeus(dataFromServer);
        } else {
          throw new Error('Error en la solicitud');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [Platform === 'ios' && trofeus]);

  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: '5%',
          marginTop: '1%'
        }}>
          <Text style={styles.title}>{t('User.User')}</Text>
          {user ? (
            <>
              <TouchableOpacity onPress={handleConfig}>
                <Ionicons name="ios-settings-outline" size={24} color="black" />
              </TouchableOpacity>
              <ConfigModal userId={user.id} configVisible={configVisible} setConfigVisible={setConfigVisible} />
            </>
          ) : (null)}
        </View>
        {!user ? (
          <ActivityIndicator />
        ) : (<View style={{ flex: 1 }}>
          <View style={styles.recuadroRojo}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Image
                style={styles.userImage}
                source={{
                  uri:
                    user.imatge,
                }}
              />
              <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <Text style={styles.name}>{user.first_name}</Text>
                <Text style={styles.username}>{user.username}</Text>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <Text style={styles.userCardText}>{t('User.Punts')}</Text>
              <Text style={styles.userCardText}>{user.puntuacio}</Text>
              <View style={styles.separator2} />
              <Link href={'/(tabs)/(user)/friendslist'} asChild>
                <TouchableOpacity >
                  <Text style={styles.userCardText}>{t('User.Amics')}</Text>
                </TouchableOpacity>
              </Link>
              <Text style={styles.userCardText}>{user.friends.length}</Text>
            </View>
          </View>
          <ScrollView
            marginTop={15}
            marginBottom={10}
          >
            <Text style={styles.titles}>{t('User.Bio')}</Text>
            <Text style={styles.bio}>{user.bio}</Text>
            <Divider />
            <Text style={styles.titles}>{t('User.Tags_favs')}</Text>
            <ScrollView
              marginTop={10}
              marginBottom={10}
              horizontal
              alwaysBounceHorizontal={true}
              contentContainerStyle={styles.chipContainer}
            >
              {user && user.tags_preferits && user.tags_preferits.length > 0 ? (
                user.tags_preferits.map((tag, index) => (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => handleTagPress(tag.id)}
                    style={[
                      { marginHorizontal: 2.5 },
                      index === 0 && { marginLeft: 15 },
                      index === user.tags_preferits.length - 1 && { marginRight: 15 },
                    ]}>
                    <Chip text={tag.nom} color="#d2d0d0" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text>{t('User.No_tags')}</Text>
              )}
            </ScrollView>
            <Link href={'/(tabs)/(user)/favplaces'} asChild></Link>
            <Divider />
            <Text style={styles.titles}>{t('User.Llocs_favs')}</Text>
            <ScrollView
              horizontal
              alwaysBounceHorizontal={true}
              contentContainerStyle={styles.chipContainer}
              marginTop={10}
              marginBottom={10}
            >
              {user && user.espais_preferits && user.espais_preferits.length > 0 ? (
                user.espais_preferits.map((espai, index) => (
                  <TouchableOpacity
                    key={espai.id}
                    onPress={() => handleChipPress(espai.id)}
                    style={[
                      { marginHorizontal: 2.5 },
                      index === 0 && { marginLeft: 15 },
                      index === user.espais_preferits.length - 1 && { marginRight: 15 },
                    ]}>
                    <Chip text={espai.nom} color="#d2d0d0" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text>{t('User.No_llocs')}</Text>
              )}
            </ScrollView>
            <Divider />
            <Text style={styles.titles}>{t('User.Trofeus')}</Text>
            <ScrollView
              horizontal
              alwaysBounceHorizontal={true}
              contentContainerStyle={styles.chipContainer}
              marginTop={10}
            >
              {trofeus && trofeus
                .sort((trofeu1, trofeu2) => {
                  if (getTrofeuColor(trofeu1) === "#d2d0d0" && getTrofeuColor(trofeu2) !== "#d2d0d0") {
                    return 1;
                  } else if (getTrofeuColor(trofeu1) !== "#d2d0d0" && getTrofeuColor(trofeu2) === "#d2d0d0") {
                    return -1;
                  } else {
                    return 0;
                  }
                })
                .map((trofeu, index) => (
                  <TouchableOpacity
                    onPress={() => handleTrofeuPress(index)}
                    key={index}
                    style={[
                      { marginHorizontal: 2.5 },
                      index === 0 && { marginLeft: 15 },
                      index === trofeus.length - 1 && { marginRight: 15 },
                    ]}
                  >
                    <Chip
                      text={trofeu.nom}
                      color={getTrofeuColor(trofeu)}
                      icon={getTrofeuIcon(trofeu)}
                    />
                    <Modal visible={selectedTrofeuIndex === index} transparent animationType="slide">
                      <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                          <Text style={styles.trofeunom}>
                            <MaterialCommunityIcons name={getTrofeuIcon(trofeu)} />
                            {trofeu.nom}
                            <MaterialCommunityIcons name={getTrofeuIcon(trofeu)} />
                          </Text>
                          <Divider />
                          <Text>Descripció del trofeu:</Text>
                          <Text style={styles.descripcio2}>{trofeu.descripcio}</Text>
                          <Divider />
                          <Text style={styles.descripcio2}>
                            {trofeu.level_achived_user !== -1 ? `Nivell ${trofeu.level_achived_user}` : t('User.Notrophy')}
                          </Text>
                          <Button title="Tancar" onPress={toggleModal} />
                        </View>
                      </View>
                    </Modal>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10%'
            }}>
              <TouchableOpacity
                style={styles.userButton}
                onPress={() => handleRanking()}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Text style={styles.buttonText}>{t('User.Ranking')}</Text>
                  <Ionicons name="ios-star-outline" size={16} color="black" />
                </View>
              </TouchableOpacity>
              <RankingModal userId={user.id} rankingVisible={rankingVisible} setRankingVisible={setRankingVisible} />
              <TouchableOpacity
                style={styles.userButton}
                onPress={() => handleEdit()}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Text style={styles.buttonText}>{t('User.Edit')}</Text>
                  <Ionicons name="ios-person-circle-outline" size={16} color="black" />
                </View>
              </TouchableOpacity>
              <EditModal userId={user.id} editVisible={editVisible} setEditVisible={setEditVisible} />
            </View>
          </ScrollView>
        </View>)}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  androidView: {
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  androidMarginTop: {
    marginTop: 40,
  },
  recuadroRojo: {
    width: '90%',
    height: 170,
    backgroundColor: '#ff6961',
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
    padding: 15,
    marginHorizontal: '5%',
  },
  userImage: {
    borderRadius: 100,
    width: 75,
    height: 75,
    marginHorizontal: '5%'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  username: {
    color: 'white',
    fontSize: 15,
  },
  userCardText: {
    marginHorizontal: '5%',
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  fotoVerificacio: {
    width: 15,
    height: 15,
    marginHorizontal: '5%'
  },
  separator2: {
    height: '100%',
    width: 0.5,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: '5%'
  },
  titles: {
    marginTop: 10,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  userButton: {
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
  buttonText: {
    fontSize: 12,
    marginRight: 5,
  },
  bio: {
    marginHorizontal: '5%',
    marginTop: 8,
  },
  botoFletxaTr: {
    width: 10,
    height: 10,
    marginTop: -5,
  },
  chipContainer: {
    paddingTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
  },
  trofeunom: {
    fontSize: 20,
    color: '#87ceec',
    fontWeight: 'bold',
  },
  descripcio2: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
});

export default User;
