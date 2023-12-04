import React from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';


const TicketDetails = ({ ticket, selectedTicketVisible, setSelectedTicketVisible }) => {
  const transformDate = (date) => {
    const dateObj = new Date(date);
    const formatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
    return formatter.format(dateObj);
  };

  const closeModal = () => {
    setSelectedTicketVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={selectedTicketVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={closeModal}>
          <Ionicons name="ios-close-outline" size={36} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Ticket</Text>
        
      </View>

    </Modal>
    
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 60,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
  },
  closeIcon: {
    top: 10,
    right: 0,
  },
});

export default TicketDetails;
