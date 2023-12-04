import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TicketCard = ({ event, data, espai, imatge }) => {
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

  return (
    <TouchableOpacity
      style={{
        width: 300,
        height: 300,
        borderRadius: 15,
        overflow: 'hidden',
        margin: 10,
      }}
    >
      <Image
        source={{ uri: imatge }}
        style={{ width: '100%', height: '100%' }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 15,
          padding: 10,
          justifyContent: 'flex-end',
        }}
      >
        <Text style={styles.title} numberOfLines={1}>{event}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{transformDate(data)}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{espai}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  subtitle: {
    color: 'white',
  },
});

export default TicketCard;
