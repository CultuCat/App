import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import Chip from '../components/chip.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import TagModal from '../components/tagModal.jsx';
import DropdownOrder from '../components/dropdownOrder.jsx';
import EventPreview from '../components/eventPreview.jsx';
import CustomCalendarPicker from '../components/calendarPicker.jsx';

export default function Page() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [tagVisible, setTagVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('dataIni');
  const [orderOption, setOrderOption] = useState('dataIni');
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [items, setItems] = useState([
    {
      label: 'Data asc', value: 'dataIni', icon: () => (
        <MaterialCommunityIcons value="dataIni" name="order-numeric-ascending" size={24} color="black" />
      )
    },
    {
      label: 'Data desc', value: '-dataIni', icon: () => (
        <MaterialCommunityIcons value="-dataIni" name="order-numeric-descending" size={24} color="black" />
      )
    },
    {
      label: 'Nom asc', value: 'nom', icon: () => (
        <MaterialCommunityIcons name="order-alphabetical-ascending" size={24} color="black" />
      )
    },
    {
      label: 'Nom desc', value: '-nom', icon: () => (
        <MaterialCommunityIcons name="order-alphabetical-descending" size={24} color="black" />
      )
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setPage(1);
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;

        const response = await fetch('https://cultucat.hemanuelpc.es/events/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const dataFromServer = await response.json();
          setData(dataFromServer.results);
        } else {
          throw new Error('Error en la solicitud');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMoreData = async () => {
    if (loading || !hasMoreData) return;

    try {
      setLoading(true);
      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const dataMin = formatDate(selectedStartDate);
      const dataMax = formatDate(selectedEndDate);

      const nextPage = page + 1;
      const url = `https://cultucat.hemanuelpc.es/events/?page=${nextPage}&data_min=${dataMin}&data_max=${dataMax}&query=${search}&${tagsQueryString}&ordering=${value}`;
      const response = await fetch(url);
      const newData = await response.json();

      if (newData?.results && newData.results.length > 0) {
        setData((prevData) => [...prevData, ...newData.results]);
        setPage(nextPage);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (date) {
      return new Date(date).toLocaleDateString().replace(/\//g, '-');
    }
    return '';
  };

  const handleAcceptCalendar = async () => {

    try {
      setIsLoading(true);
      const userTokenString = await AsyncStorage.getItem("@user");
      const userToken = JSON.parse(userTokenString).token;
      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const dataMin = formatDate(selectedStartDate);
      const dataMax = formatDate(selectedEndDate);
      const response = await fetch(`https://cultucat.hemanuelpc.es/events/?data_min=${dataMin}&data_max=${dataMax}&query=${search}&${tagsQueryString}&ordering=${value}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const filteredEvents = await response.json();
        setData(filteredEvents.results);
        setPage(1);
        if (data.length > 0) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }
      } else {
        console.error('Error en la solicitud GET:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = useNavigation();
  const handlePressMap = () => {
    navigation.navigate('map');
  };

  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };




  const handleAccept = async () => {
    try {
      setIsLoading(true);
      const userTokenString = await AsyncStorage.getItem("@user");
      const userToken = JSON.parse(userTokenString).token;

      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const dataMin = formatDate(selectedStartDate);
      const dataMax = formatDate(selectedEndDate);
      const response = await fetch(`https://cultucat.hemanuelpc.es/events/?query=${search}&${tagsQueryString}&ordering=${value}&data_min=${dataMin}&data_max=${dataMax}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const filteredEvents = await response.json();
        setPage(1);
        setData(filteredEvents.results);
      } else {
        console.error('Error en la solicitud GET:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
    } finally {
      setIsLoading(false);
    }
    setTagVisible(false);
  };

  const handleOpenTags = () => {
    setTagVisible(true);
  };
  const handleOpenCalendar = () => {
    setCalendarVisible(true);
  };
  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };


  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [search]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);

      const userTokenString = await AsyncStorage.getItem("@user");
      const userToken = JSON.parse(userTokenString).token;
      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const dataMin = formatDate(selectedStartDate);
      const dataMax = formatDate(selectedEndDate);
      const response = await fetch(`https://cultucat.hemanuelpc.es/events/?query=${search}&${tagsQueryString}&ordering=${value}&data_min=${dataMin}&data_max=${dataMax}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newData = await response.json();
        setData(newData.results);
        if (newData.results.length > 0) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }
        setPage(1)
      } else {
        console.error('Error en la solicitud GET:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOrderChange = async (selectedValue) => {
    try {
      setIsLoading(true);
      setValue(selectedValue);
      setHasMoreData(true);

      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const dataMin = formatDate(selectedStartDate);
      const dataMax = formatDate(selectedEndDate);
      const url = `https://cultucat.hemanuelpc.es/events/?query=${search}&${tagsQueryString}&ordering=${selectedValue}&data_min=${dataMin}&data_max=${dataMax}`;

      const response = await fetch(url);
      const dataFromServer = await response.json();

      if (response.ok) {
        setData(dataFromServer.results);
      } else {
        console.error('Error en la solicitud:', response.status, response.statusText);
        setHasMoreData(false);
      }
      setPage(1);
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }

  };


  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <Text style={styles.title}>{t('Search.Search')}</Text>
        <View style={{ marginHorizontal: '3%', marginBottom: '3%' }}>
          <SearchBar
            inputContainerStyle={styles.searchBarInputContainer}
            placeholder={t('Search.Busca')}
            onChangeText={(text) => setSearch(text)}
            onClear={() => handleSearch()}
            value={search}
            platform="ios"
          />
        </View>
        <View style={{ marginHorizontal: '5%', zIndex: 100 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '4%', zIndex: 100 }}>
            <DropdownOrder defaultValue={orderOption} items={items} onValueChange={handleOrderChange} />
            <TouchableOpacity style={styles.mapButton} onPress={handlePressMap}>
              <Ionicons name="ios-location-outline" size={16} color="black" marginRight="4%" />
              <Text style={styles.mapText}> {t('Search.Mapa')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2%' }}>
            <TouchableOpacity style={{ marginRight: '2%' }} onPress={handleOpenTags}>
              <Chip text='Tags' color="#87ceec" flex='1' />
            </TouchableOpacity>
            <TagModal
              tagVisible={tagVisible}
              setTagVisible={setTagVisible}
              onAccept={handleAccept}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            <TouchableOpacity onPress={handleOpenCalendar}>
              <Chip text='Data' color="#87ceec" />
            </TouchableOpacity>
            <CustomCalendarPicker
              calendarVisible={calendarVisible}
              setCalendarVisible={setCalendarVisible}
              onAccept={handleAcceptCalendar}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              setSelectedStartDate={setSelectedStartDate}
              setSelectedEndDate={setSelectedEndDate}
            />
          </View>

        </View>
        {isloading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            ListHeaderComponentStyle={{ zIndex: 10 }}
            renderItem={({ item }) => (
              <EventPreview
                event={item.nom}
                dataIni={item.dataIni}
                dataFi={item.dataFi}
                espai={item.espai.nom}
                imatge={item.imatges_list[0]}
                onPress={() => handlePressEvent(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: '5%' }}
            onEndReachedThreshold={0.5}
            onEndReached={loadMoreData}
          />
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: '5%',
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    marginTop: 14,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  itemText: {
    flex: 1,
  },
  titleItem: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ubicacion: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  data: {
    fontSize: 12,
    color: '#f07b75',
    marginTop: 5,
  },
  camera: {
    fontSize: 20,
    color: '#f07b75',
    marginLeft: 330,
    marginTop: 30,
  },
  ticket: {
    fontSize: 19,
    color: '#f07b75',
    marginLeft: 190,
    marginTop: 5,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6961',
    padding: 10,
    borderRadius: 10,
    borderColor: '#ff6961',
    borderWidth: 1,
    marginRight: '2%',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  searchBarInputContainer: {
    height: 30,
    borderWidth: 0,
    borderRadius: 10,
    default: 'ios',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    width: '45%',
    alignItems: 'center',
    borderColor: 'black'
  },

});
