import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


const TagModal = ({
  tagVisible,
  setTagVisible,
  onAccept,
  selectedTags,
  setSelectedTags,
}) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const userTokenString = await AsyncStorage.getItem("@user");
      const userToken = JSON.parse(userTokenString).token;
      const response = await fetch('https://cultucat.hemanuelpc.es/tags', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const tagsFromServer = await response.json();
        setTags(tagsFromServer);
      } else {
        throw new Error('Error en la solicitud');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTagPress = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((selectedTag) => selectedTag !== tag)
        : [...prevTags, tag]
    );
  };

  const closeTags = () => {
    setTagVisible(false);
  };

  return (
    <Modal animationType="slide" visible={tagVisible} onBackdropPress={closeTags}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={closeTags}>
          <Ionicons name="ios-close-outline" size={36} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('Filters.Tags')}</Text>
        <ScrollView style={{ marginBottom: 20 }}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              onPress={() => handleTagPress(tag)}
              style={{
                padding: 10,
                borderBottomWidth: 0.5,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: selectedTags.includes(tag) ? colors.primary : 'white',
              }}
            >
              <Text>{tag.nom}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.filter}
          onPress={onAccept}
        >
          <Text style={{ fontSize: 18, color: 'black' }}>{t('Filters.Filter')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 60,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: colors.terciary,
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
  },
  closeIcon: {
    top: 10,
    right: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    marginRight: 50,
  },
  filter: {
    width: '100%',
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default TagModal;
