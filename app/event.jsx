import React from 'react';
import { Text, View, Linking, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ShareMenu from './components/shareMenu.jsx';
import Chip from './components/chip.jsx';
import colors from '../constants/colors';
import CommentForm from './components/commentForm.jsx';
import Comment from './components/comment.jsx';

export default function Page() {

  const handleMaps = () => {
    const mapUrl = "https://maps.google.com/?q=41.637325,2.1574353";

    Linking.openURL(mapUrl)
      .catch((err) => console.error('Error al abrir el enlace: ', err));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <ImageBackground
            style={styles.fotoLogo}
            source={{
              uri:
                'https://paral-lel62.cat/wp-content/uploads/2023/09/maxresdefault.jpg',
            }}
          >
            <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]}>
              <Link href={'/(tabs)/home'} replace asChild>
                <Ionicons name="ios-close-outline" size={36} color="black" />
              </Link>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, styles.buyIcon]} >
              <Ionicons name="bookmark-outline" size={24} color="black" style={{ margin: 6 }} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, styles.shareIcon]} >
              <Ionicons name="share-social-outline" size={24} color="black" style={{ margin: 6 }} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={{ marginHorizontal: '7.5%' }}>
          <Text style={styles.title}>The Tyets</Text>
          <Text style={{ color: '#ff6961' }}>dv, 10 novembre</Text>
          <Text>Balaguer</Text>
          <Chip text="Music" color="#d2d0d0"></Chip>
          <Text style={styles.subtitle}>Descripció de l'esdeveniment</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget aliquet odio. Integer fringilla turpis vitae purus ultricies, nec bibendum dolor fermentum. Sed venenatis massa a justo venenatis, sit amet scelerisque augue bibendum. Vivamus luctus, justo sit amet interdum tincidunt, arcu libero tincidunt ipsum, non feugiat urna ex at risus. Nulla facilisi. Vestibulum tincidunt quam in quam laoreet, ac aliquam felis volutpat. Curabitur vel metus ut libero efficitur tincidunt. Sed non ligula eu est dignissim scelerisque. Curabitur ultricies lectus eget laoreet tincidunt. Vivamus in justo varius, posuere orci at, egestas metus.</Text>
          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity style={styles.accionButton}>
              <Text style={{ margin: 10 }}>Veure usuaris que asisteixen a l'event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accionButton} onPress={handleMaps}>
              <Text style={{ margin: 10 }}>Veure ubicació al mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accionButton}>
              <Text style={{ margin: 10 }}>Afegir a calendari</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Comentaris</Text>
          <CommentForm></CommentForm>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <Comment username={item.username} data={item.time} text={item.text} />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Text style={styles.price}>18.00€</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={{ fontSize: 20, marginHorizontal: 15, marginVertical: 10 }}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const comments = [
  {
    username: "Ericriiera",
    time: "today",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac sapien quis libero ullamcorper varius. In ut turpis id quam auctor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam auctor bibendum justo, a rhoncus turpis hendrerit ac. Maecenas id tellus sed dolor tempus congue. Nunc at diam vel massa mattis elementum ac a dolor. Nulla facilisi. Sed in lacinia nunc. Quisque vel justo euismod, feugiat arcu ac, efficitur ipsum. Sed vulputate mi id odio consequat, sit amet varius neque rhoncus. Integer eu sollicitudin libero."
  },
  {
    username: "Marc",
    time: "today",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac sapien quis libero ullamcorper varius. In ut turpis id quam auctor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam auctor bibendum justo, a rhoncus turpis hendrerit ac. Maecenas id tellus sed dolor tempus congue. Nunc at diam vel massa mattis elementum ac a dolor. Nulla facilisi. Sed in lacinia nunc. Quisque vel justo euismod, feugiat arcu ac, efficitur ipsum. Sed vulputate mi id odio consequat, sit amet varius neque rhoncus. Integer eu sollicitudin libero."
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginVertical: 20,
    width: '85%',
    marginHorizontal: '7.5%',
    aspectRatio: 1,
  },
  fotoLogo: {
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
  },
  closeIcon: {
    top: 10,
    right: 10,
  },
  buyIcon: {
    bottom: 10,
    right: 55,
  },
  shareIcon: {
    bottom: 10,
    right: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 25,
  },
  accionButton: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 2,

  },
  bottomContainer: {
    backgroundColor: colors.primary,
    height: '12%',
  },
  price: {
    position: 'absolute',
    bottom: '40%',
    left: '8%',
    fontSize: 25,
    margin: 5,
  },
  buyButton: {
    position: 'absolute',
    bottom: '40%',
    right: '8%',
    backgroundColor: colors.terciary,
    color: 'black',
    borderRadius: 100,
  },
});
