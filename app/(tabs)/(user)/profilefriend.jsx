import {  ScrollView,Text, View,StyleSheet, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { React, useState, useEffect } from 'react';
import Chip from '../../components/chip.jsx';
import Divider from '../../components/divider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProfileFriend() {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const route = useRoute();
  const userId = route.params.id;
  const navigation = useNavigation();

  const handleBackToProfile = () => {
    navigation.navigate('user'); 
  };
  const goBackToFriendList = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userId)
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: '5%'
      }}>
        <Text style={styles.title}>{t('User.User')}</Text>
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
            <Text style={styles.userCardText}>{t('User.Punts')}</Text>
            <Text style={styles.userCardText}>{user.puntuacio}</Text>
            <View style={styles.separator2} />
            <Text style={styles.userCardText}>{t('User.Amics')}</Text>  
            <Text style={styles.userCardText}>{user.friends.length}</Text>
          </View>
        </View>
        <ScrollView>
          <Text style={styles.titles}>{t('User.Bio')}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          <Divider />
          <Text style={styles.titles}>{t('User.Tags_favs')}</Text>
          <ScrollView
            horizontal
            alwaysBounceHorizontal={true}
            contentContainerStyle={styles.chipContainer}
          >
            { user.tags_preferits.length > 0 ? (
              user.tags_preferits.map((tag, index) => (
                <TouchableOpacity
                  key={tag.id}
                 
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
          >
            {user.espais_preferits.length > 0 ? (
              user.espais_preferits.map((espai, index) => (
                <TouchableOpacity
                  key={espai.id}
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
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10%'
          }}>
            <TouchableOpacity
              style={styles.userButton}
              onPress={handleBackToProfile}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.buttonText}>{t('Tornar al Perfil')}</Text>
                <Ionicons name="ios-arrow-back" size={16} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userButton}
              onPress={goBackToFriendList}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.buttonText}>{t('FriendList')}</Text>
                <Ionicons name="ios-arrow-back" size={16} color="black" />
              </View>
            </TouchableOpacity>
           
          </View>
        </ScrollView>
      </View>)}
    </ SafeAreaView>
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
    backgroundColor: '#87ceec',
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


