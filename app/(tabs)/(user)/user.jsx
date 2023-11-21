import React from 'react';
import { Text, View, Button, StyleSheet, Image,TouchableOpacity, Alert,Modal } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import Chip from '../../components/chip.jsx';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Page() {
  const styles = StyleSheet.create({

    recuadroRojo: {
      width: 300, 
      height: 170, 
      backgroundColor: '#ff6961', 
      borderRadius: 30,

    },
    container: {
      alignItems: 'center',
      marginTop: 8,
    },
    fotoLogo: {
      borderRadius: 30,
      width: 70,
      height: 70,
      marginTop: 20,
      marginLeft: 20,
    },
    configuracio: {
      borderRadius: 30,
      width: 20,
      height: 20,
      marginLeft: 330,
      marginTop: 7,
    },
    username: {
      textAlign: 'center',
      marginTop: -18,
      color: 'white',
      marginLeft: 20,
      fontSize: 15,
    },
    punts: {
      marginLeft: 30,
      marginTop: -20,
      color: 'white',
      fontSize: 17,
      fontWeight: 'bold',
    },
    numpunts: {
      marginLeft: 100,
      marginTop: 65,
      color: 'white',
      fontSize: 17,
      fontWeight: 'bold',
    },
    separator: {
      height: 0.5,
      backgroundColor: 'black', 
      width: 200,
      alignSelf: 'center',
      marginTop: 25,
    },
    titles: {
      marginTop:20,
      marginLeft: 40,
      fontWeight: 'bold',
    },
    rankingButton: {
      width: 130, 
      height: 40, 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: 'black', 
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6, 
      marginLeft: 40,
      marginTop: 40,
    },
    editButton: {
      width: 130, 
      height: 40, 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: 'black', 
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6, 
      marginLeft: 197,
      marginTop: -81,
    },
    rankingText: {
      fontSize: 12, 
      marginRight: 20,

    },
    editText: {
      fontSize: 12, 
      marginRight: 20,    

    },
    bio: {
      marginLeft: 100,
    },
    fotoStar: {
      width: 15,
      height: 15,
      marginLeft: 145,
      marginBottom: 55,
      marginTop:-29,
      
    },
    fotoProfile: {
      width: 15,
      height: 15,
      marginLeft: 95,
      marginBottom: -14,
      
      
    },
    friends: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 170,
      marginTop: -20,
      fontSize: 17,   
    },
    numfriends: {
      color: 'white',
      marginLeft: 250,
      marginTop: -25,
      fontWeight: 'bold',
      fontSize: 17,
    },
    followersButton: {
      marginTop: -40,
      marginRight: 80,
    },
    fotoVerificacio: {
      marginLeft: 220,
      marginTop : -50,
      width: 15,
      height: 15,
    },
    separator2: {
      height: 30,
      backgroundColor: 'white', 
      width: 0.5,
      alignSelf: 'center',
      marginTop: -25,
    },
    botoFletxa: {
      width: 10,
      height: 10,
      marginTop: -40,
    },
    botoFletxaTr: {
      width: 10,
      height: 10,
      marginTop: -5,
    },
    fletxaButton: {
      borderColor: 'transparent',
      marginLeft: 310,
      marginTop: -10,
    },
    chipContainer: {
      paddingTop: 10,
      marginRight: 50,
      flexDirection: 'row', 
      
    },
    
    scroll: {
      marginRight: 75,
      marginLeft: 60,
    }
    
    
  });
  const [user, setUser] = useState(null);
  const [chips, setChips] = useState(["Tarragona", "Barcelona", "Begues","Gavà"]); 
  const [trofeus, setTrofeus] = useState(["Trofeu1", "Trofeu2", "Trofeu3"]);
  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  const [selectedTagIndex, setSelectedTagIndex] = useState(null);
  const [tags, setTags] = useState(null); 


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
      "Eliminar lloc favorit",
      "Estàs segur que vols eliminar el lloc favorit ?",
      [
        { text: "Cancelar", onPress: () => setSelectedTagIndex(null), style: "cancel" },
        { text: "Eliminar", onPress: () => handleDeleteTag(tagId) },
      ]
    );
  };
  const handleTrofeuPress = (index) => {
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

  const handleDeleteChip = (index) => {
    const updatedChips = [...chips];
    updatedChips.splice(index, 1);
    setChips(updatedChips);
    setSelectedChipIndex(null);
  };
  const handleDeleteTag = (tagId) => {
    const index = user.tags_preferits.findIndex((tag) => tag.id === tagId);
    if (index !== -1) {
      const updatedTags = [...user.tags_preferits];
      
      updatedTags.splice(index, 1);
  
      setUser((prevUser) => ({
        ...prevUser,
        tags_preferits: updatedTags,
      }));
  
      setSelectedTagIndex(null);
    }
  };
  

  const getLocalUser = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;
  
      const data = JSON.parse(dataString);
      console.log(data.user.id);
      return data.user.id;
    } catch (error) {
      console.error('Error getting local user data:', error);
      return null;
    }
  };
  

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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  if (!user) {
    return <Text>Cargando...</Text>;
  }


  return (
    <ScrollView>
    <View>
      <Link href={'/(tabs)/(user)/configuration'} asChild>
      <TouchableOpacity >
        <Image
              style={styles.configuracio}
              source={{
                uri:
                  'https://images.vexels.com/media/users/3/153359/isolated/preview/f253c46ff6fb727415fc70750ac1fb6e-configuracion-del-sistema-icono-de-trazo-de-color.png',
              }}
            />
      </TouchableOpacity>
      </Link>
      <View style={styles.container}>
        <View style={styles.recuadroRojo}>
          <Image
            style={styles.fotoLogo}
            source={{
              uri:
              user.imatge,
            }}
          /> 
            <Image
              style={styles.fotoVerificacio}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/6364/6364343.png',
              }}
            />

      
      <Text style= {styles.username}>{user.username}</Text>
      <Text style={styles.numpunts}>{user.puntuacio}</Text>
      <Text style={styles.punts}>Punts</Text>
      <View style={styles.separator2}/>
      <Text style={styles.numfriends}>20</Text>

      <Link href={'/(tabs)/(user)/friendslist'} asChild>
        <TouchableOpacity >
          <Text style={styles.friends}>Amics</Text>
        </TouchableOpacity>
      </Link>
      </View>
      </View>
      <Text style={styles.titles}>Bio</Text>
      <Text style={styles.bio}>{user.bio}</Text>
      <View style={styles.separator}/>
      <Text style={styles.titles}>Tags Favorites</Text>
      <ScrollView
        horizontal
        alwaysBounceHorizontal={true}
        contentContainerStyle={styles.chipContainer}
        style={styles.scroll}
      >
        {user && user.tags_preferits && user.tags_preferits.length > 0 ? (
          user.tags_preferits.map((tag) => (
            <TouchableOpacity key={tag.id} onPress={() => handleTagPress(tag.id)} style={{ marginRight: 5 }}>
              <Chip text={tag.nom} color="#d2d0d0" />
            </TouchableOpacity>
          ))
        ) : (
          <Text>No tags available</Text>
        )}
      </ScrollView>


        
      <TouchableOpacity
          style={styles.fletxaButton}
        >
            <Image
                style={styles.botoFletxaTr}
                source={{
                  uri:
                    'https://cdn-icons-png.flaticon.com/512/60/60762.png',
                }}
         />    
      </TouchableOpacity>
      <Link href={'/(tabs)/(user)/favplaces'} asChild></Link>
      <View style={styles.separator}/>
      <Text style={styles.titles}>Llocs Favorits</Text>
      <ScrollView
          horizontal
          alwaysBounceHorizontal={true}
          contentContainerStyle={styles.chipContainer}
          style={styles.scroll}
          
        >
          {chips.map((chip, index) => (
            <TouchableOpacity key={index} onPress={() => handleChipPress(index)} 
               style={{ marginRight: 5}}>
              <Chip text={chip} color="#d2d0d0" />
            </TouchableOpacity>
          ))}
          </ScrollView>
      <TouchableOpacity
          style={styles.fletxaButton}
        >
            <Image
                style={styles.botoFletxa}
                source={{
                  uri:
                    'https://cdn-icons-png.flaticon.com/512/60/60762.png',
                }}
         />    
      </TouchableOpacity>
      <View style={styles.separator}/>
      <Text style={styles.titles}>Trofeus</Text>
      <ScrollView
        horizontal
        alwaysBounceHorizontal={true}
        contentContainerStyle={styles.chipContainer}
        style={styles.scroll}
      >
        {trofeus.map((trofeu, index) => (
          <TouchableOpacity key={index} onPress={() => handleTrofeuPress(index)} style={{ marginRight: 5 }}>
            <Chip text={trofeu} color="#d2d0d0" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
          style={styles.fletxaButton}
        >
            <Image
                style={styles.botoFletxaTr}
                source={{
                  uri:
                    'https://cdn-icons-png.flaticon.com/512/60/60762.png',
                }}
         />    
      </TouchableOpacity>
      <View style={styles.separator}/>
      <TouchableOpacity
        style={styles.rankingButton}
        onPress={() => Alert.alert('Cannot press this one')}
      >
      <Text style={styles.rankingText}>Veure rànquing</Text>
      </TouchableOpacity>
      <Image
              style={styles.fotoStar}
              source={{
                uri:
                  'https://cdn-icons-png.flaticon.com/512/149/149220.png',
              }}
      />
      <View>
      <Link href={'/(tabs)/(user)/editprofile'} asChild>
        <TouchableOpacity
          style={styles.editButton}
        >
            <Image
                style={styles.fotoProfile}
                source={{
                  uri:
                    'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
                }}
          />
        <Text style={styles.editText}>Editar perfil</Text>
        </TouchableOpacity>
      </Link>
      </View>
      </View>
      </ScrollView>
  );
}
