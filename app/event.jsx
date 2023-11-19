import React, { useEffect, useState } from 'react';
import { Text, View, Linking, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Chip from './components/chip.jsx';
import colors from '../constants/colors';
import CommentForm from './components/commentForm.jsx';
import Comment from './components/comment.jsx';
import ShareMenu from './components/shareMenu.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';




export default function Page() {

  const [event, setEvent] = useState([]);
  const [commentsEvent, setComments] = useState([]);
  const params = useLocalSearchParams();
  const image = '';
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [buyButtonEnabled, setBuyButtonEnabled] = useState(true);
  const route = useRoute();
  const eventId = route.params.eventId;
  const [selectedDiscountCode, setSelectedDiscountCode] = useState(null);
  const [discountCodes, setDiscountCodes] = useState([]); 
  const [discountInfo, setDiscountInfo] = useState(null);

  const openModal = () => {
    fetch('https://cultucat.hemanuelpc.es/discounts/')
      .then((response) => response.json())
      .then((discountData) => {
        setDiscountCodes(discountData);
      })
      .catch((error) => console.error('Error al obtener códigos de descuento:', error));

    setModalVisible(true);
  };

  const handleDiscountCodeValidation = (discountCodeId) => {
    console.log("Handling discount validation for:", discountCodeId);
    if (!discountCodeId) {
      setDiscountInfo(null);
      return;
    }
  
    const url = `https://cultucat.hemanuelpc.es/discounts/?userDiscount=${encodeURIComponent(discountCodeId)}`;
 
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error in the request. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((discountInfoFromServer) => {
        console.log('Discount info from server:', discountInfoFromServer);
        setDiscountInfo(discountInfoFromServer);
        console.log(discountInfo);
      })
      .catch((error) => {
        console.error('Error fetching discount info:', error.message);
      });
  };
  

  const applyDiscount = (price, nivellTrofeu) => {
    if (!discountInfo) {
      return price;
    }
    if (price == 'Gratuït') {
      return 'Gratuït';
    }
  
    let discountPercentage;
    switch (nivellTrofeu) {
      case 1:
        discountPercentage = 0.1;
        break;
      case 2:
        discountPercentage = 0.25;
        break;
      case 3:
        discountPercentage = 0.5;
        break;
      default:
        discountPercentage = 0;
    }
    
    return price - discountPercentage * price; 
  };

  const closeModal = () => {
    setModalVisible(false);
  };
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
    fetch('http://127.0.0.1:8000/comments/?event=' + params.eventId, {
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
    fetch('http://127.0.0.1:8000/events/' + params.eventId, {
      method: "GET"
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then((dataFromServer) => {
        setEvent(dataFromServer);
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
            <TouchableOpacity style={[styles.iconContainer, styles.buyIcon]} >
              <Ionicons name="bookmark-outline" size={24} color="black" style={{ margin: 6 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareIcon}>
              <ShareMenu enllac={event?.enllaços_list?.length > 0 ? event.enllacos_list[0] : "https://analisi.transparenciacatalunya.cat/Cultura-oci/Agenda-cultural-de-Catalunya-per-localitzacions-/rhpv-yr4f"} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={{ marginHorizontal: '7.5%' }}>
          <Text style={styles.title}>{event.nom}</Text>
          <Text style={{ color: '#ff6961' }}>{event.dataIni}</Text>
          <Text>{event.espai}</Text>
          <Chip text="Music" color="#d2d0d0"></Chip>
          <Text style={styles.subtitle}>Descripció de l'esdeveniment</Text>
          <Text>{event.descripcio}</Text>
          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity style={styles.accionButton}>
              <Text style={{ margin: 10 }}>Veure usuaris que asisteixen a l'event</Text>
            </TouchableOpacity>
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
        <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Vols comprar una entrada per aquest event?
            </Text>
            {discountCodes.length > 0 && (
              <View style={styles.pickerContainer}>
                <Text>Validar codi descompte:</Text>
                <Picker
                  selectedValue={selectedDiscountCode}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedDiscountCode(itemValue);
                    handleDiscountCodeValidation(itemValue); 
                  }}
                >
                  <Picker.Item label="Selecciona un codi" value={null} />
                  {discountCodes.map((code) => (
                    <Picker.Item key={code.codi} label={code.codi} value={code.userDiscount} />
                  ))}
                </Picker>

              </View>
            )}
    
            {discountInfo && (
              <View style={styles.discountInfoContainer}>
                <Text style={styles.discountInfoText} >{`Preu Final: ${applyDiscount(parsedPriceCalc(event.preu), discountInfo[0].nivellTrofeu)}€`}</Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleYesClick}
                style={[styles.button, { backgroundColor: '#ff6961' }]}
              >
                <Text style={styles.buttonText}>Si</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeModal}
                style={[
                  styles.button,
                  {
                    borderColor: 'black',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>     
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
      <Text style={styles.price}>{parsedPrice(event.preu)}</Text>
        <TouchableOpacity
          style={[styles.buyButton, { opacity: buyButtonEnabled ? 1 : 0.5 }]}
          onPress={openModal}
          disabled={!buyButtonEnabled}
        >
          <Text style={{ fontSize: 20, marginHorizontal: 15, marginVertical: 10 }}>Comprar</Text>
        </TouchableOpacity>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 30,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  discountInfoContainer: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
    marginLeft: -140,
  },
  discountInfoText: {
    fontSize: 16,
    color: '#ff6961',
    fontWeight: 'bold',
  },
});
