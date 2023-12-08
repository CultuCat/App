import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, Switch } from 'react-native';
import TicketCard from '../components/ticketCard';
import TicketDetails from '../components/ticketDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketVisible, setSelectedTicketVisible] = useState(false);
  const { t } = useTranslation();

  const today = new Date();

  const filteredTickets = showAllTickets
    ? tickets
    : tickets.filter((ticket) => new Date(ticket.data) >= today);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedTicketVisible(true);
  }

  const renderTicketCard = ({ item }) => (
    <TicketCard
      event={item.nomEvent}
      data={item.data}
      espai={item.espai}
      imatge={item.imatge}
      onPress={() => handleTicketClick(item)}
      style={{ margin: 5 }}
    />
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await getLocalUser();
        if (!id) {
          console.error('User data not found in AsyncStorage');
          return;
        }
        const response = await fetch(`https://cultucat.hemanuelpc.es/tickets/?user=${id}`);

        if (!response.ok) {
          throw new Error('No se pudo obtener el archivo JSON');
        }
        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>{t('Carregant')}</Text>
      ) : tickets.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: '10%', marginVertical: 20 }}>
            <Switch
              style={{ zIndex: 1 }}
              value={showAllTickets}
              onValueChange={(value) => setShowAllTickets(value)}
            />
            <Text style={{ marginLeft: 10 }}>{t('Ticket.Tots')}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {filteredTickets.length > 0 ? (
              <FlatList
                data={filteredTickets}
                renderItem={renderTicketCard}
                keyExtractor={(item) => item.nomEvent}
                contentContainerStyle={{ alignItems: 'center' }}
              />
            ) : (
              <Text>{t('Ticket.No_tickets_propers')}</Text>
            )}
          </View>
          {selectedTicket && (
            <TicketDetails
              ticket={selectedTicket}
              selectedTicketVisible={selectedTicketVisible}
              setSelectedTicketVisible={setSelectedTicketVisible}
            />
          )}
        </View>
      ) : (
        <Text>{t('Ticket.No_tickets')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default Tickets;
