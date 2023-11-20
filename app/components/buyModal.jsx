import React from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuyModal = ({
    buyVisible,
    setBuyVisible,
    setBuyButtonEnabled,
}) => {
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
