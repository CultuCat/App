import React from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { useTranslation } from 'react-i18next';
import { transformDate } from '../../functions/transformDate';


const TicketDetails = ({ ticket, selectedTicketVisible, setSelectedTicketVisible }) => {
  const { t } = useTranslation();

  const dowloadTicket = (url) => {
    Linking.openURL(url)
      .catch((err) => console.error('Error al descargar el archivo: ', err));
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
      <View style={[styles.modalContainer, Platform.OS === 'android' && { marginTop: '0' }]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1%'
        }}>
          <Text style={styles.title}>{t('Ticket.Entrada_a')}</Text>
          <TouchableOpacity style={styles.iconContainer} onPress={closeModal}>
            <Ionicons name="ios-close-outline" size={36} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={styles.ticketContainer}>
            <Image
              source={{ uri: ticket.imatges_list[0] }}
              style={styles.imatge}
            />
            <View style={styles.ticketDetails}>
              <Text style={styles.ticketTextTitle}>{ticket.nomEvent}</Text>
              {ticket.dataIni === ticket.dataFi ? (
                <Text style={styles.ticketTextDate}>
                  {transformDate(ticket.dataIni)}
                </Text>
              ) : (
                <>
                  <Text style={styles.ticketTextDate}>{transformDate(ticket.dataIni)} -</Text>
                  <Text style={styles.ticketTextDate}>{transformDate(ticket.dataFi)}</Text>
                </>
              )}
              <Text style={styles.ticketText}>{ticket.espai}</Text>
            </View>
          </View>
          <View style={styles.divider}></View>
          <Image
            source={{ uri: ticket.image }}
            style={styles.qr}
          />
          <TouchableOpacity style={styles.downloadButton} onPress={() => dowloadTicket(ticket.pdf_url)}>
          <Ionicons name="download-outline" size={30} color="black" style={{padding: 5, paddingLeft: 6}} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 60,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  modalContent: {
    backgroundColor: 'white',
    flex: 1,
  },
  ticketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginVertical: 5,
  },
  ticketTextTitle: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  ticketTextDate: {
    fontSize: 16,
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
    marginTop: 50,
  },
  downloadButton: {
    aspectRatio: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#ff6961',
    position: 'absolute',
    right: 10,
    bottom: '5%',
  }
});

export default TicketDetails;
