import React from 'react';
import { Text, View, Button, StyleSheet, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import Chip from '../../components/chip.jsx';
import { ScrollView } from 'react-native';
import Divider from '../../components/divider';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import RankingModal from '../../components/rankingModal.jsx';

const User = () => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [chips, setChips] = useState(null);
  const [selectedTrofeuIndex, setSelectedTrofeuIndex] = useState(null);
  const [trofeus, setTrofeus] = useState(null);
  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  const [selectedTagIndex, setSelectedTagIndex] = useState(null);
  const [rankingVisible, setRankingVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [iconName, setIconName] = useState('heart-outline');

  const handleIconClick = async () => {
    setIconName('time-outline');
  
    const response = await fetch(`https://cultucat.hemanuelpc.es/${this.currentUser}/send_friend_request/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "to_user": user.id,
      }),
    });
  
    if (!response.ok) {
      console.error('Error en la solicitud POST:', response);
    } else {
      const data = await response.json();
      console.log('Respuesta de la solicitud POST:', data);
    }
  };

  const handleRanking = () => {
    setRankingVisible(true);
  }

  const handleChipPress = (index) => {
    setSelectedChipIndex(index);
    Alert.alert(
      "Eliminar lloc favorit",
      "Estàs segur que vols eliminar el lloc favorit ?",
      [
        { text: "Cancelar", onPress: () => setSelectedChipIndex(null), style: "cancel" },
        { text: "Eliminar", onPress: () => handleDeleteChip(index) },
      ]
    );
  };
  const handleTagPress = (tagId) => {
    setSelectedTagIndex(tagId);
    Alert.alert(
      "Eliminar tag",
      "Estàs segur que vols eliminar aquesta tag ?",
      [
        { text: "Cancelar", onPress: () => setSelectedTagIndex(null), style: "cancel" },
        { text: "Eliminar", onPress: () => handleDeleteTag(tagId) },
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
        Alert.alert('Espai Eliminat', 'El lloc preferit ha estat eliminat correctament');
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
        Alert.alert('Tag Eliminat', 'El tag ha estat eliminat correctament');
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
      default:
        return "#d2d0d0";
    }
  };
  const getTrofeuIcon = (trofeu) => {
    switch (trofeu.nom) {
      case "Més esdeveniments":
        return "trophy-award";
      case "Reviewer":
        return "trophy-outline";
      case "Parlaner":
        return "trophy-variant";
      case "Coleccionista":
        return "trophy";
      case "El més amigable":
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
        setCurrentUser(userID);
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
  }, []);

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
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 60, marginHorizontal: '5%' }}>
          <Text>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 60 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: '5%'
        }}>
          <Text style={styles.title}>Usuari</Text>
          
          {user.id !== currentUser && (
            <TouchableOpacity onPress={handleIconClick}>
              <Ionicons name={iconName} size={24} color="black" />
            </TouchableOpacity>
          )}

          <Link href={'/(tabs)/(user)/configuration'} asChild>
            <TouchableOpacity>
              <Ionicons name="ios-settings-outline" size={24} color="black" />
            </TouchableOpacity>
          </Link>
        </View>
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
            <Image
              style={styles.fotoVerificacio}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/6364/6364343.png',
              }}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <Text style={styles.userCardText}>Punts</Text>
            <Text style={styles.userCardText}>{user.puntuacio}</Text>
            <View style={styles.separator2} />
            <Link href={'/(tabs)/(user)/friendslist'} asChild>
              <TouchableOpacity >
                <Text style={styles.userCardText}>Amics</Text>
              </TouchableOpacity>
            </Link>
            <Text style={styles.userCardText}>{user.friends.length}</Text>
          </View>
        </View>
        <ScrollView>
          <View style={{ flex: 1, marginBottom: 250 }}>
            <Text style={styles.titles}>Bio</Text>
            <Text style={styles.bio}>{user.bio}</Text>
            <Divider />
            <Text style={styles.titles}>Tags Favorites</Text>
            <ScrollView
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
                <Text>No hi ha tags</Text>
              )}
            </ScrollView>
            <Link href={'/(tabs)/(user)/favplaces'} asChild></Link>
            <Divider />
            <Text style={styles.titles}>Llocs Favorits</Text>
            <ScrollView
              horizontal
              alwaysBounceHorizontal={true}
              contentContainerStyle={styles.chipContainer}
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
                <Text>No hi ha llocs preferits</Text>
              )}
            </ScrollView>
            <Divider />
            <Text style={styles.titles}>Trofeus</Text>
            <ScrollView
              horizontal
              alwaysBounceHorizontal={true}
              contentContainerStyle={styles.chipContainer}
            >
              {trofeus && trofeus
              .filter((trofeu) => trofeu.level_achived_user !== -1)
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
                        <Text style={styles.descripcio2}>Nivell {trofeu.level_achived_user}</Text>
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
                  <Text style={styles.buttonText}>Veure rànquing</Text>
                  <Ionicons name="ios-star-outline" size={16} color="black" />
                </View>
              </TouchableOpacity>
              <RankingModal userId={user.id} rankingVisible={rankingVisible} setRankingVisible={setRankingVisible} />
              <Link href={'/(tabs)/(user)/editprofile'} asChild>
                <TouchableOpacity
                  style={styles.userButton}
                >
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <Text style={styles.buttonText}>Editar perfil</Text>
                    <Ionicons name="ios-person-circle-outline" size={16} color="black" />
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    marginVertical: 15,
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
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  trofeunom: {
    fontSize: 20,
    color: '#ff6961',
    fontWeight: 'bold',
  },
  descripcio2: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default User;
