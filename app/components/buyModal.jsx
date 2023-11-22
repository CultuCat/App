import React, { useEffect,useState } from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuyModal = ({
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
        try {
            await AsyncStorage.setItem(`buyButtonEnabled_${eventId}`, 'false');
        } catch (error) {
            console.error('Error al guardar el estado del botón de compra:', error);
        }
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
    
    useEffect(() => {
        fetch('https://cultucat.hemanuelpc.es/discounts/')
      .then((response) => response.json())
      .then((discountData) => {
        setDiscountCodes(discountData);
      })
      .catch((error) => console.error('Error al obtener códigos de descuento:', error));
      }, []);
    

    return (
        <Modal
        animationType="slide"
        visible={buyVisible}
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
});

export default BuyModal;
