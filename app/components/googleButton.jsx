import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const GoogleButton = ({ onPress }) => {
  return (
    <Link href={'/(tabs)/home'} replace asChild>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
      >
        <View style={styles.content}>
          <Image
            source={require('../../assets/google_icon.png')}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
          <Text style={styles.text}>Continue with Google</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default GoogleButton;
