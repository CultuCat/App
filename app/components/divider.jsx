import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#ccc', // Puedes ajustar el color según tus preferencias
    marginVertical: 10, // Ajusta este valor según sea necesario
  },
});

export default Divider;