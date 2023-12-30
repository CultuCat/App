import React, { useEffect, useState } from 'react';
import { Platform, Text, View, Linking, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, FlatList, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Chip from './components/chip.jsx';
import colors from '../constants/colors';
import CommentForm from './components/commentForm.jsx';
import Comment from './components/comment.jsx';
import ShareMenu from './components/shareMenu.jsx';
import { useNavigation, useRoute } from '@react-navigation/native';
import BuyModal from './components/buyModal.jsx';
import UserListModal from './components/userListModal.jsx';
import * as Calendar from 'expo-calendar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transformDate } from '../functions/transformDate.js';


export default function Page() {

  const [event, setEvent] = useState([]);
  const [commentsEvent, setComments] = useState([]);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [usersVisible, setUsersVisible] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);
  const [buyButtonEnabled, setBuyButtonEnabled] = useState(true);
  const route = useRoute();
  const eventId = route.params.eventId;
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const eventNom = event.nom;
  const { t } = useTranslation();

  const handleBuy = () => {
    setBuyVisible(true);
  };

  const handleUsers = () => {
    setUsersVisible(true);
  }

  const checkButtonState = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@user");
      if (!dataString) return null;

      const data = JSON.parse(dataString);
      const userId = data.user.id;

      const isUserAttending = event && Array.isArray(event.assistents) && event.assistents.length > 0 && event.assistents.some((assistant) => {
        return assistant.id === userId;
      });

      setBuyButtonEnabled(isUserAttending);
    } catch (error) {
      console.error('Error al recuperar el estado del botón de compra:', error);
    }
  };


  const fetchComments = () => {
    fetch('https://cultucat.hemanuelpc.es/comments/?event=' + params.eventId, {
      method: 'GET'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error in the request');
        }
      })
      .then((dataFromServer) => {
        setComments(dataFromServer);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://cultucat.hemanuelpc.es/events/${params.eventId}`, {
      method: "GET"
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((error) => {
        console.error(error);
      });
      fetchComments();
  }, []);

  useEffect(() => {
    checkButtonState();
  }, [event]);


  const handleMaps = () => {
    const mapUrl = `https://maps.google.com/?q=${event.latitud},${event.longitud}`;

    Linking.openURL(mapUrl)
      .catch((err) => console.error('Error al abrir el enlace: ', err));
  };

  const getCalendarPermission = async () => {
    const calendarPermission = await Calendar.requestCalendarPermissionsAsync();

    if (calendarPermission.status !== 'granted') {
      Alert.alert(t('Event.Perm_calendar'));
    } else {
      let remindersPermission = { status: 'granted' };

      if (Platform.OS === 'ios') {
        remindersPermission = await Calendar.requestRemindersPermissionsAsync();
      }

      if (remindersPermission.status !== 'granted') {
        Alert.alert(t('Event.Perm_recordatoris'));
      } else {
        const calendarList = await Calendar.getCalendarsAsync();
        setCalendars(calendarList);
      }
    }
  };

  const addEventToCalendar = async () => {
    try {
      await getCalendarPermission();

      let selectedCalendar;

      if (Platform.OS === 'ios') {
        const calendarOptions = calendars.map(calendar => ({
          text: calendar.title,
          onPress: () => {
            selectedCalendar = calendar;
            createEvent(selectedCalendar);
          },
        }));

        Alert.alert(t('Event.Calendar'), null, calendarOptions);
      } else {
        const calendars = await Calendar.getCalendarsAsync();
        selectedCalendar = calendars[0];

        createEvent(selectedCalendar);
      }
    } catch (error) {
      console.error('Error al agregar evento al calendario:', error);
      Alert.alert(t('Event.Error_agregar'));
    }
  };

  const createEvent = async (selectedCalendar) => {
    if (!selectedCalendar) {
      Alert.alert(t('Event.Seleccio_calendar'));
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const eventDetails = {
      title: event?.nom,
      startDate: new Date(event?.dataIni),
      endDate: new Date(new Date(event?.dataIni).getTime() + 60 * 60 * 1000),
      timeZone: timeZone,
      location: event?.espai?.nom,
      alarms: [{ relativeOffset: -60, method: Calendar.AlarmMethod.DEFAULT }],
    };

    try {
      const eventId = await Calendar.createEventAsync(selectedCalendar.id, eventDetails);
      Alert.alert(t('Event.Afegit_calendar'));
    } catch (error) {
      console.error('Error al agregar evento al calendario:', error);
      Alert.alert(t('Event.Error_agregar'));
    }
  };

  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <ScrollView style={[Platform.OS === 'ios' && {height: '94%'}, Platform.OS === 'android' && {height: '90%'}]}>
              <View style={styles.imageContainer}>
                <ImageBackground
                  style={styles.fotoLogo}
                  source={{
                    uri: event?.imatges_list?.length > 0 ? event.imatges_list[0] : 'https://www.legrand.es/modules/custom/legrand_ecat/assets/img/no-image.png',
                  }}
                >
                  <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={() => navigation.goBack()}>
                    <Ionicons name="ios-close-outline" size={36} color="black" />
                  </TouchableOpacity>
                  <View style={[styles.iconContainer, styles.buyIcon]} >
                    <Ionicons name="bookmark-outline" size={24} color="black" style={{ margin: 6 }} />
                  </View>
                  <TouchableOpacity style={styles.shareIcon}>
                    <ShareMenu enllac={event?.enllacos_list?.length > 0 ? event.enllacos_list[0] : "https://analisi.transparenciacatalunya.cat/Cultura-oci/Agenda-cultural-de-Catalunya-per-localitzacions-/rhpv-yr4f"} />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
              <View style={{ marginHorizontal: '7.5%' }}>
                <Text style={styles.title}>{event.nom}</Text>
                <Text style={{ color: '#ff6961' }}>{transformDate(event?.dataIni)}</Text>
                <Text>{event.espai?.nom}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {event.tags?.map((tag) => (
                    <View key={tag.id} style={{ marginRight: '1%', marginTop: '1%' }}>
                      <Chip text={tag.nom} color="#87ceec" />
                    </View>
                  ))}
                </View>
                <Text style={styles.subtitle}>{t('Event.Descripcio')}</Text>
                <Text>{event.descripcio}</Text>
                <Text style={styles.subtitle}>{t('Event.Do_you_know')}</Text>
                <Text>{event.pregunta?.question.content}</Text>
                <Text>{event.pregunta?.question.correct_answer}</Text>
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity style={styles.accionButton} onPress={handleUsers}>
                    <Text style={{ margin: 10 }}>{t('Event.Assistents')}</Text>
                  </TouchableOpacity>
                  <UserListModal eventId={event.id} usersVisible={usersVisible} setUsersVisible={setUsersVisible} />
                  <TouchableOpacity style={styles.accionButton} onPress={handleMaps}>
                    <Text style={{ margin: 10 }}>{t('Event.Ubicacio')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.accionButton} onPress={addEventToCalendar}>
                    <Text style={{ margin: 10 }}>{t('Event.Afegir_cal')}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.subtitle}>{t('Event.Comentaris')}</Text>
                <CommentForm eventId={event.id} fetchComments={fetchComments} />
                <FlatList
                  data={commentsEvent.results}
                  renderItem={({ item }) => (
                    <Comment username={item.user} time={item.created_at} text={item.text} />
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
              <Text style={[Platform.OS === 'ios' && styles.iosPrice, Platform.OS === 'android' && styles.androidPrice]}>
                {isNaN(event.preu) ? event.preu : `${Number(event.preu)} €`}
              </Text>
              <TouchableOpacity
                style={[Platform.OS === 'ios' && styles.iosBuyButton, Platform.OS === 'android' && styles.androidBuyButton,
                {
                  opacity: buyButtonEnabled || event.preu == t('Event.No_disp') ? 0.5 : 1,
                },
                ]}
                onPress={handleBuy}
                disabled={buyButtonEnabled || event.preu === t('Event.No_disp')}
              >
                <Text style={{ fontSize: 20, marginHorizontal: 15, marginVertical: 10 }}>Comprar</Text>
              </TouchableOpacity>
              <BuyModal eventNom={eventNom} eventId={eventId} price={event.preu} buyVisible={buyVisible} setBuyVisible={setBuyVisible} setBuyButtonEnabled={setBuyButtonEnabled} />
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  androidView: {
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  androidMarginTop: {
    marginTop: 40,
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
    position: 'absolute',
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
    height: '11%',
  },
  iosPrice: {
    position: 'absolute',
    bottom: '40%',
    left: '8%',
    fontSize: 25,
    margin: 5,
  },
  iosBuyButton: {
    position: 'absolute',
    bottom: '40%',
    right: '8%',
    backgroundColor: colors.terciary,
    color: 'black',
    borderRadius: 100,
  },
  androidPrice: {
    position: 'absolute',
    bottom: '32%',
    left: '8%',
    fontSize: 25,
    margin: 5,
  },
  androidBuyButton: {
    position: 'absolute',
    bottom: '32%',
    right: '8%',
    backgroundColor: colors.terciary,
    color: 'black',
    borderRadius: 100,
  },
});
