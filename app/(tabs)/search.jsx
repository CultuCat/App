import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import Chip from '../components/chip.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import TagModal from '../components/tagModal.jsx';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Page() {
  const { t } = useTranslation();

  const Item = ({ title, ubicacion, data, image, id }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePressEvent(id)}>
      {image ? (
        <Image source={{ uri: image.uri }} style={styles.image} />
      ) : (
        <Image
          source={{
            uri:
              'https://th.bing.com/th/id/R.78f9298564b10c30b16684861515c670?rik=zpQaqTcSRIc4jA&pid=ImgRaw&r=0',
          }}
          style={styles.image}
        />
      )}
      <View style={styles.itemText}>
        <Text style={styles.titleItem}>{title}</Text>
        <Text style={styles.data}>{data}</Text>
        <Text style={styles.ubicacion}>{ubicacion}</Text>
        <TouchableOpacity>
          <MaterialIcons style={styles.ticket} name="local-activity" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [tagVisible, setTagVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [orderOption, setOrderOption] = useState('dataIni');
  const [items, setItems] = useState([
    { label: 'Data asc', value: 'dataIni',  icon: () => (
      <MaterialCommunityIcons value= "dataIni"name="order-numeric-ascending" size={24} color="black" />
   )
    },
    { label: 'Data desc',  value: 'dataFi', icon: () => (
      <MaterialCommunityIcons value= "-dataIni" name="order-numeric-descending" size={24} color="black" />
   )
    },
    { label: 'Nom asc' ,value: 'nom', icon: () => (
    <MaterialCommunityIcons name="order-alphabetical-ascending" size={24} color="black" />
    )
  },
    { label: 'Nom desc' ,value: '-nom',icon: () => (
      <MaterialCommunityIcons name="order-alphabetical-descending" size={24} color="black" />
      )
    },
  ]);

  const [orderDirection, setOrderDirection] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;
        
        const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');

        const response = await fetch(`https://cultucat.hemanuelpc.es/events/?page=${page}&query=${search}&ordering=${value}&${tagsQueryString}`, {
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
  }, [orderOption, orderDirection, page, search, selectedTags]);


  const loadMoreData = async () => {
    if (loading || !hasMoreData) return;

    try {
      setLoading(true);
      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');
      const nextPage = page + 1;
      const url = `https://cultucat.hemanuelpc.es/events/?page=${nextPage}&query=${search}&${tagsQueryString}&ordering=${value}`;
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

  const navigation = useNavigation();
  const handlePressMap = () => {
    navigation.navigate('map');
  };

  const handlePressEvent = (eventId) => {
    navigation.navigate('event', { eventId });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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


  const handleAccept = async () => {
    try {
      setIsLoading(true);
      const userTokenString = await AsyncStorage.getItem("@user");
      const userToken = JSON.parse(userTokenString).token;

      const tagsQueryString = selectedTags.map((tag) => `tag=${tag.id}`).join('&');

      const response = await fetch(`https://cultucat.hemanuelpc.es/events/?query=${search}&${tagsQueryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const filteredEvents = await response.json();
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
      const response = await fetch(`https://cultucat.hemanuelpc.es/events/?query=${search}&${tagsQueryString}`, {
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

  const handleOrderChange = (selectedValue) => {
    setValue(selectedValue);
  
    fetch(`https://cultucat.hemanuelpc.es/events/?ordering=${selectedValue}`)
      .then(response => response.json())
      .then(data => {

        setData(data.results);
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  


  
  return (
    <View style={[{ flex: 1 }, Platform.OS === 'android' && styles.androidView]}>
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && styles.androidMarginTop]}>
        <Text style={styles.title}>{t('Search.Search')}</Text>
        <View style={{ marginHorizontal: '3%' }}>
          <SearchBar
            inputContainerStyle={styles.searchBarInputContainer}
            placeholder={t('Search.Busca')}
            onChangeText={(text) => setSearch(text)}
            onClear={() => handleSearch()}
            value={search}
            platform="ios"
          />
        </View>
        <View style={{ marginHorizontal: '5%', zIndex: '100' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '6%' , zIndex: '100'}}>
          <DropDownPicker
            defaultValue={orderOption}
            containerStyle={{
              height: 40,
              width: 120,
              marginRight: 10,
            }}
            style={{ backgroundColor: '#ff6961',minHeight: 40,}}
            labelStyle={{
              fontSize: 14,
              textAlign: 'left',
              color: 'white',
              
            }}
            dropDownStyle={{ backgroundColor: '#fafafa'}}
            onSelectItem={(item) => {
              console.log(item);
              setValue(item.value);
              handleOrderChange(item.value);
            }}
            onChangeItem={(item) => {
              setValue(item.value);
              handleOrderChange(item.value);
              setValue(item.value);
              setOpen(false);
            }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Ordenar"
            placeholderStyle={{ color: "black" }}
            placeholderIcon={() => (
              <MaterialCommunityIcons name="order-alphabetical-descending" size={60} color="black" />
            )}
          />
            <TouchableOpacity style={styles.mapButton} onPress={handlePressMap}>
              <Text style={styles.mapText}> {t('Search.Mapa')}</Text>
              <Ionicons name="ios-location-outline" size={16} color="black" marginLeft="4%" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2%' }}>
            <TouchableOpacity style={{ marginRight: '1%' }} onPress={handleOpenTags}>
              <Chip text='Tags' color="#87ceec" />
            </TouchableOpacity>
            <TagModal
              tagVisible={tagVisible}
              setTagVisible={setTagVisible}
              onAccept={handleAccept}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            <TouchableOpacity style={{ marginRight: '2%' }}>
              <Chip text='Preu' color="#87ceec" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Chip text='Data' color="#87ceec" />
            </TouchableOpacity>
          </View>
          
        </View>
        {isloading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            ListHeaderComponentStyle={{ zIndex: 10 }}
            renderItem={({ item, index }) => (
              <Item
                title={item.nom}
                data={item.dataIni}
                ubicacion={item.espai.nom}
                image={item.imatges_list && item.imatges_list.length > 0 ? { uri: item.imatges_list[0] } : null}
                id={item.id}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.99}
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
