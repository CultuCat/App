import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, Text, Switch, SafeAreaView } from 'react-native';
import EventCard from '../components/eventCard';
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
    : tickets.filter((ticket) => new Date(ticket.dataFi) >= today);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedTicketVisible(true);
  }

  const renderTicketCard = ({ item }) => (
    <EventCard
      event={item.nomEvent}
      data={item.dataIni}
      espai={item.espai}
      imatge={item.imatges_list[0]}
      onPress={() => handleTicketClick(item)}
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('Ticket.Ticket')}</Text>
      {loading ? (
        <ActivityIndicator />
      ) : tickets.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: '5%', marginVertical: 15 }}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: '5%',
  },
});

export default Tickets;
