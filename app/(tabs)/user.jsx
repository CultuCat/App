import React from 'react';
import { Text, View, Button, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  const styles = StyleSheet.create({
    boldtext: {
      fontWeight: 'bold', 
      fontSize: 16, 
      marginLeft: 5,
      marginTop: 5,
    },
    recuadroRojo: {
      width: 300, 
      height: 190, 
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
      marginTop: -15,
    },
    username: {
      textAlign: 'center',
      marginTop: -90,
      color: 'white',
      marginLeft: 20,
    },
    punts: {
      marginLeft: 30,
      marginTop: 30,
      color: 'white',
      fontSize: 17,
      fontWeight: 'bold',
    },
    numpunts: {
      marginLeft: 220,
      marginTop: 55,
      color: 'white',
      fontSize: 17,
      fontWeight: 'bold',
    },
    separator: {
      height: 0.5,
      backgroundColor: 'black', 
      width: 200,
      alignSelf: 'center',
      marginTop: 20,
    },
    titles: {
      marginTop:20,
      marginLeft: 40,
      fontWeight: 'bold',
    },
    rankingButton: {
      width: 300, 
      height: 40, 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: 'black', 
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6, 
      marginLeft: 40,
      marginTop: 20,
    },
    rankingText: {
      fontSize: 12, 
      marginRight: 20,

    },
    fotoStar: {
      width: 15,
      height: 15,
      marginLeft: 250,
      marginBottom: 60,
      marginTop:-30,
      
    },
    
  });

  return (
    <View>
      <Text style={styles.boldtext}> User page</Text>
      <Image
            style={styles.configuracio}
            source={{
              uri:
                'https://images.vexels.com/media/users/3/153359/isolated/preview/f253c46ff6fb727415fc70750ac1fb6e-configuracion-del-sistema-icono-de-trazo-de-color.png',
            }}
          />
      <View style={styles.container}>
        <View style={styles.recuadroRojo}>
          <Image
            style={styles.fotoLogo}
            source={{
              uri:
                'https://fotografias.antena3.com/clipping/cmsimages02/2018/04/27/15C4A825-FBD2-49FC-B669-AA3AA7C57CB6/98.jpg?crop=1920,1080,x0,y0&width=1900&height=1069&optimize=high&format=webply',
            }}
          />
          <Text style={styles.punts}>Punts</Text>
          <Text style= {styles.username}>clararubiio</Text>
          <Text style={styles.numpunts}>33</Text>
        </View>
      </View>
      <Text style={styles.titles}>Favorite Tags</Text>
      <View style={styles.separator}/>
      <Text style={styles.titles}>Favorite Places</Text>
      <View style={styles.separator}/>
      <Text style={styles.titles}>Trophies</Text>
      <View style={styles.separator}/>
      <TouchableOpacity
        style={styles.rankingButton}
        onPress={() => Alert.alert('Cannot press this one')}
      >
        <Text style={styles.rankingText}>Check ranking</Text>
      </TouchableOpacity>
      <Image
              style={styles.fotoStar}
              source={{
                uri:
                  'https://cdn-icons-png.flaticon.com/512/149/149220.png',
              }}
          />
      <Link href={'/'} replace asChild>
        <Button title='Log out' />
      </Link>
    </View>
  );
}
