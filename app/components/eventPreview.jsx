import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import colors from '../../constants/colors';


const EventPreview = ({ event, data, espai, imatge, onPress }) => {
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

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
    >
      <Image
        source={{ uri: imatge }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {truncateText(event, 25)}
        </Text>
        <Text style={styles.date} numberOfLines={1}>
          {transformDate(data)}
        </Text>
        <Text style={styles.espai} numberOfLines={1}>
          {truncateText(espai, 38)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: '2.5%',
    width: '100%',
  },
  image: {
    height: 75,
    borderRadius: 10,
    aspectRatio: 1,
    marginRight: '2%',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    color: colors.primary,
  },
  espai: {
    // Agrega estilos según tus necesidades
  },
});

export default EventPreview;

