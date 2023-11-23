import React, { useEffect,useState } from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const BuyModal = ({
    eventNom,
    eventId,
    price,
    buyVisible,
    setBuyVisible,
    setBuyButtonEnabled,
}) => {
    const [selectedDiscountCode, setSelectedDiscountCode] = useState(null);
    const [discountCodes, setDiscountCodes] = useState([]); 
    const [discountInfo, setDiscountInfo] = useState(null);
    const closeModal = () => {
        setBuyVisible(false);
    };
    

    const handleYesClick = async () => {
      setBuyVisible(false);
      setBuyButtonEnabled(false);
    
      const userTokenString = await AsyncStorage.getItem("@user");

      const userToken = JSON.parse(userTokenString).token;
      const userId = JSON.parse(userTokenString).id;
    
      try {
        await AsyncStorage.setItem(`buyButtonEnabled_${eventId}`, 'false');
    
        const response = await fetch('https://cultucat.hemanuelpc.es/tickets/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${userToken}`,
            
          },
          body: JSON.stringify({
            eventId: eventId,
          }),
        });
    
        if (response.ok) {
          console.log('Solicitud POST exitosa');
        } else {
          console.error('Error en la solicitud POST:', response.status);
        }
      } catch (error) {
        console.error('Error al guardar el estado del botón de compra o al hacer la solicitud POST:', error);
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
    
    const handleDiscountCodeValidation = async (discountCodeId) => {
      console.log("Handling discount validation for:", discountCodeId);
  
      if (!discountCodeId) {
        setDiscountInfo(null);
        return;
      }
  
      const selectedDiscount = discountCodes.find(
        (discount) => discount.codi === discountCodeId
      );
  
      if (selectedDiscount) {
        setDiscountInfo(selectedDiscount);
      } else {
        console.error("Descuento no encontrado en discountCodes");
      }
    };
  
    useEffect(() => {
      const fetchDiscountCodes = async () => {
        try {
          const userId = await getLocalUser();
    
          const response = await fetch(
            `https://cultucat.hemanuelpc.es/discounts/?userDiscount=${encodeURIComponent(userId)}`
          );
    
          if (!response.ok) {
            throw new Error('Error en la solicitud de códigos de descuento');
          }
    
          const discountData = await response.json();
    
          const filteredDiscounts = discountData.filter((discount) => !discount.usat);
    
          setDiscountCodes(filteredDiscounts);
          console.log('discounts', discountCodes);
        } catch (error) {
          console.error('Error al obtener códigos de descuento:', error);
        }
      };
    
      fetchDiscountCodes();
    }, []);
    
    
    const applyDiscount = (price, nivellTrofeu) => {
        if (!discountInfo) {
          return price;
        }
        if (price == 'Gratuït') {
          return 'Gratuït';
        }
        if (price > 100 || price < 1) {
          return 'No disponible'
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
    
    
    

    return (
        <Modal
        animationType="slide"
        visible={buyVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Vols comprar una entrada per {eventNom}?
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
                    <Picker.Item key={code.codi} label={code.codi} value={code.codi} />
                  ))}
                </Picker>

              </View>
            )}
    
            {discountInfo && (
              <View style={styles.discountInfoContainer}>
                <Text style={styles.discountInfoText}>
                  {`Preu Final: ${
                    applyDiscount(price, discountInfo.nivellTrofeu) !== 'No disponible' &&
                    applyDiscount(price, discountInfo.nivellTrofeu) !== 'Gratuit'
                      ? applyDiscount(price, discountInfo.nivellTrofeu) + '€'
                      : applyDiscount(price, discountInfo.nivellTrofeu)
                  }`}
                </Text>
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
    );
};

const styles = StyleSheet.create({
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
      marginLeft: 0,
    },
    discountInfoText: {
      fontSize: 16,
      color: '#ff6961',
      fontWeight: 'bold',
    },
});

export default BuyModal;
