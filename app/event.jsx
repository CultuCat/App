import React, { useEffect, useState } from 'react';
import { Text, View, Linking, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Chip from './components/chip.jsx';
import colors from '../constants/colors';
import CommentForm from './components/commentForm.jsx';
import Comment from './components/comment.jsx';
import ShareMenu from './components/shareMenu.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import BuyModal from './components/buyModal.jsx';
import UserListModal from './components/userListModal.jsx';


export default function Page() {

  const [event, setEvent] = useState([]);
  const [commentsEvent, setComments] = useState([]);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [usersVisible, setUsersVisible] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);
  const [buyButtonEnabled, setBuyButtonEnabled] = useState(true);
  const route = useRoute();
  const eventId = route.params.eventId;
  const eventNom = event.nom;
  


  const handleBuy = () => {
    setBuyVisible(true);
  };

  const handleUsers = () => {
    setUsersVisible(true);
  }


  useEffect(() => {
    checkButtonState();
  }, []);
  const handleYesClick = async () => {
  
    setModalVisible(false);
    setBuyButtonEnabled(false);
    
  
    try {
      await AsyncStorage.setItem(`buyButtonEnabled_${eventId}`, 'false');
    } catch (error) {
      console.error('Error al guardar el estado del botón de compra:', error);
    }
  };
    const checkButtonState = async () => {
      try {
        const value = await AsyncStorage.getItem(`buyButtonEnabled_${eventId}`);
        if (value !== null) {
          setBuyButtonEnabled(value === 'false' ? false : true);
        }
      } catch (error) {
        console.error('Error al recuperar el estado del botón de compra:', error);
      }
    };
    
    useEffect(() => {
      checkButtonState();
    }, []);
    
  

  const fetchComments = () => {
    fetch('https://cultucat.hemanuelpc.es/comments/?event=' + params.eventId, {
      method: 'GET'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error in the request');
        }
      })
      .then((dataFromServer) => {
        setComments(dataFromServer);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetch(`https://cultucat.hemanuelpc.es/events/${params.eventId}`, {
      method: "GET"
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);


  useEffect(() => {
    fetchComments();
  }, []);

  const handleMaps = () => {
    const mapUrl = `https://maps.google.com/?q=${event.latitud},${event.longitud}`;

    Linking.openURL(mapUrl)
      .catch((err) => console.error('Error al abrir el enlace: ', err));
  };
  const parsedPrice = (price) => {
    if (price && price.includes('€'))
      return price;
    else return 'Gratuït'
  };

  const parsedPriceCalc = (price) => {
    if (price && typeof price === 'string') {

      const numericPart = price.replace(/[^0-9.]/g, '');

      const numericValue = parseFloat(numericPart);
  
      if (!isNaN(numericValue)) {
        return numericValue;
      }
    }
  
    return 'Gratuït';
  };
  
  if (event == []) {
    return <Text>Cargando...</Text>;
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <ImageBackground
            style={styles.fotoLogo}
            source={{
              uri: event?.imatges_list?.length > 0 ? event.imatges_list[0] : 'https://www.legrand.es/modules/custom/legrand_ecat/assets/img/no-image.png',
            }}
          >
            <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={() => navigation.goBack()}>
              <Ionicons name="ios-close-outline" size={36} color="black" />
            </TouchableOpacity>
            <View style={[styles.iconContainer, styles.buyIcon]} >
              <Ionicons name="bookmark-outline" size={24} color="black" style={{ margin: 6 }} />
            </View>
            <TouchableOpacity style={styles.shareIcon}>
              <ShareMenu enllac={event?.enllacos_list?.length > 0 ? event.enllacos_list[0] : "https://analisi.transparenciacatalunya.cat/Cultura-oci/Agenda-cultural-de-Catalunya-per-localitzacions-/rhpv-yr4f"} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={{ marginHorizontal: '7.5%' }}>
          <Text style={styles.title}>{event.nom}</Text>
          <Text style={{ color: '#ff6961' }}>{event.dataIni}</Text>
          <Text>{event.espai?.nom}</Text>
          <Chip text="Music" color="#d2d0d0"/>
          <Text style={styles.subtitle}>Descripció de l'esdeveniment</Text>
          <Text>{event.descripcio}</Text>
          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity style={styles.accionButton} onPress={handleUsers}>
              <Text style={{ margin: 10 }}>Veure assistents a l'esdeveniment</Text>
            </TouchableOpacity>
            <UserListModal eventId={event.id} usersVisible={usersVisible} setUsersVisible={setUsersVisible}/>
            <TouchableOpacity style={styles.accionButton} onPress={handleMaps}>
              <Text style={{ margin: 10 }}>Veure ubicació al mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accionButton}>
              <Text style={{ margin: 10 }}>Afegir a calendari</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Comentaris</Text>
          <CommentForm eventId={event.id} fetchComments={fetchComments} />
          <FlatList
            data={commentsEvent.results}
            renderItem={({ item }) => (
              <Comment username={item.user} time={item.created_at} text={item.text} />
            )}
            keyExtractor={item => item.id}
          />
            
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
      <Text style={styles.price}>{parsedPrice(event.preu)}</Text>
        <TouchableOpacity
          style={[styles.buyButton, { opacity: buyButtonEnabled ? 1 : 0.5 }]}
          onPress={handleBuy}
          disabled={!buyButtonEnabled}
        >
          <Text style={{ fontSize: 20, marginHorizontal: 15, marginVertical: 10 }}>Comprar</Text>
        </TouchableOpacity>
        <BuyModal eventNom={eventNom} eventId={eventId} price={parsedPriceCalc(event.preu)} buyVisible={buyVisible} setBuyVisible={setBuyVisible} setBuyButtonEnabled={setBuyButtonEnabled}/>
      </View>
    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 60,
  },
  imageContainer: {
    marginVertical: 20,
    width: '85%',
    marginHorizontal: '7.5%',
    aspectRatio: 1,
  },
  fotoLogo: {
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
  },
  closeIcon: {
    top: 10,
    right: 10,
  },
  buyIcon: {
    bottom: 10,
    right: 55,
  },
  shareIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 25,
  },
  accionButton: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 2,

  },
  bottomContainer: {
    backgroundColor: colors.primary,
    height: '12%',
  },
  price: {
    position: 'absolute',
    bottom: '40%',
    left: '8%',
    fontSize: 25,
    margin: 5,
  },
  buyButton: {
    position: 'absolute',
    bottom: '40%',
    right: '8%',
    backgroundColor: colors.terciary,
    color: 'black',
    borderRadius: 100,
  },
  
});
