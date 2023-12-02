import React , { useState,useEffect } from 'react';
import { Text , StyleSheet,TouchableOpacity, Image, View, TextInput} from 'react-native';
import { MaterialIcons} from "@expo/vector-icons";
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const [first_name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState(''); 
  const [user, setUser] = useState(null);
  const {t} =useTranslation();

  const styles = StyleSheet.create({
    fotoProfile: {
      borderRadius: 80,
      width: 140,
      height: 140,
      marginTop: 30,
      marginLeft: 110,
    },
    camera: {
      fontSize: 30,
      color:'black',
      marginLeft: 200,
      marginTop: -26,
    },
    lock: {
      fontSize: 24,
      color:'black',
      marginLeft: 65,
      marginTop: -45,
    },
    input: {
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      marginTop: 30,
      marginLeft: 150,
      borderRadius: 15,
    },
    input2: {
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      marginTop: 40,
      marginLeft: 150,
      borderRadius: 15,
    },
    
    username: {
      fontWeight: 'bold',
      marginLeft: 50,
      marginTop: -40,
    
    },
    pickerContainer: {
      marginLeft: 155,
      marginTop: 40, 
    },

    genere: {
      fontWeight: 'bold',
      marginLeft: 50,
      marginTop: -30,
      
    },
    contrasenya: {
      fontWeight: 'bold',
      marginLeft: 50,
      marginTop: -25,
      marginBottom: 34,
    },
    cancelButton: {
      width: 130, 
      height: 40, 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: 'black', 
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6, 
      marginLeft: 40,
      marginTop: 25,
      marginBottom: 10,
    },
    saveButton: {
      width: 130, 
      height: 40, 
      backgroundColor: '#ff6961', 
      borderWidth: 1, 
      borderColor: 'black', 
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6, 
      marginLeft: 220,
      marginTop: -50,
      
    },
    container: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f3f3f3',   
      borderRadius: 8, 
      paddingHorizontal: 14, 
      marginTop: 40,
  },
    icon: {
      marginTop: 15,
      marginLeft: 10,
      
    },
    input3: {
      color: '#333', 
      paddingVertical: 10, 
      padding: 10, 
      fontSize: 12, 
      marginLeft: 150,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 15,
      marginTop: 40,
      width: 200,
      height: 80,
    },
    visibilitatText: {
      fontWeight: 'bold',
      marginLeft: -280,
      marginTop: 20,
    },
    visibilitatButton: {
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
  }, []);
    
    
  
    if (!user) {
      return <Text>{t('Carregant')}</Text>;
    }
    const handleSaveChanges = async () => {
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
        console.log(userToken);
  
        const updatedProfile = {
          first_name: first_name || user.first_name,
          bio: bio || user.bio,
          username: username || user.username,
        };
        console.log(first_name);
  
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${userID}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProfile),
        });
  
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
  
        const updatedUserData = await response.json();
        setUser(updatedUserData);
  
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    };

  return (
  <View>
    <TouchableOpacity >
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
    <TextInput
        style={styles.input}
        placeholder={user.username}
        value={username}
        onChangeText={(text) => setUsername(text)} 
       
    />
    <Text style= {styles.username}>{t('Edit_User.Username')}: </Text>
    <TextInput
        style={styles.input2}
        placeholder={user.first_name}
        value={first_name}
        onChangeText={text => setName(text)}
    />
    <Text style= {styles.username}>{t('Edit_User.Nom')}: </Text>
    <TextInput
        style={styles.input3}
        placeholder={user.bio}
        value={bio}
        onChangeText={text => setBio(text)}
    />
    <Text style= {styles.genere}>{t('Edit_User.Bio')}: </Text>
    <View style={styles.container}>
    </View>
    <Link href={'(user)/user'} asChild>
    <TouchableOpacity
        style={styles.cancelButton}
      >
      <Text style={styles.rankingText}>{t('Cancel')}</Text>
    </TouchableOpacity>
    </Link>
    
    <Link href={'(user)/user'} asChild>
    <TouchableOpacity
        style={styles.saveButton } onPress={handleSaveChanges}
      >
      <Text style={styles.rankingText}>{t('Edit_User.Desar_can')}</Text>
    </TouchableOpacity>
    </Link>  
  </View>
  );
   
        }