import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { transformDate } from '../../functions/transformDate';

const EventCard = ({ event, dataIni, dataFi, espai, imatge, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: '5%',
        marginVertical: '2.5%',
        width: '90%',
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
        {dataIni === dataFi ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {transformDate(dataIni)}
          </Text>
        ) : (
          <Text style={styles.subtitle} numberOfLines={1}>
            {transformDate(dataIni)} - {transformDate(dataFi)}
          </Text>
        )}
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

export default EventCard;
