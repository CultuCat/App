import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { useTranslation } from 'react-i18next';


const TicketDetails = ({ ticket, selectedTicketVisible, setSelectedTicketVisible }) => {
  const { t } = useTranslation();
  const [info, setInfo] = useState('');

  const transformDate = (date) => {
    const dateObj = new Date(date);
    const formatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
    return formatter.format(dateObj);
  };

  const closeModal = () => {
    setSelectedTicketVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        id = ticket.id;
        const response = await fetch(`https://cultucat.hemanuelpc.es/tickets/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo obtener el archivo JSON');
        }
        const data = await response.json();
        setInfo(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [ticket.id]);

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
        <Text style={styles.title}>{t('Ticket.Entrada_a')}</Text>
        <View style={styles.ticketContainer}>
          <Image
            source={{ uri: ticket.imatge }}
            style={styles.imatge}
          />
          <View style={styles.ticketDetails}>
            <Text style={styles.ticketTextTitle}>{ticket.nomEvent}</Text>
            <Text style={styles.ticketTextDate}>{transformDate(ticket.data)}</Text>
            <Text style={styles.ticketText}>{ticket.espai}</Text>
          </View>
        </View>
        <View style={styles.divider}></View>
        <Image
          source={{ uri: info.image }}
          style={styles.qr}
        />
      </View>
    </Modal>

  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
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
  ticketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    alignSelf: 'flex-start'
  },
  imatge: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  ticketDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketText: {
    fontSize: 16,
    marginBottom: 5,
  },
  ticketTextTitle: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  ticketTextDate: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.secondary,
  },
  divider: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    marginBottom: 20,
    marginTop: 10,
  },
  qr: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 100,
  }
});

export default TicketDetails;
