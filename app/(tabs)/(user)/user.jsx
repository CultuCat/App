import React from 'react';
import { Text, View, Button, StyleSheet, Image,TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';

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
      marginTop: 20,
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
      marginTop: 15,
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
    
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Hacer una solicitud GET para obtener el perfil del usuario usando fetch
    fetch('http://127.0.0.1:8000/users/7/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      });
  }, []);

  if (!user) {
    return <Text>Cargando...</Text>;
  }


  return (
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
      <View style={styles.separator}/>
      <Text style={styles.titles}>Llocs Favorits</Text>
      <View style={styles.separator}/>
      <Text style={styles.titles}>Trofeus</Text>
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
  );
}
