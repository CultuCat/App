import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal,StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TagModal = ({
  modalVisible,
  onCloseModal,
  onTagPress,
  onAccept,
  tags,
  selectedTags,
}) => {
  return (
    <Modal visible={modalVisible} onBackdropPress={onCloseModal}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
            style={[styles.iconContainer, styles.closeIcon]}
            onPress={onCloseModal}
          >
            <Ionicons name="ios-close-outline" size={26} color="black" />
      </TouchableOpacity>
        <View style={{ marginTop: 70 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', marginLeft: 6 }}>
            Escull els tags pels que vols filtrar
          </Text>
          <ScrollView style={{ marginBottom: 100 }}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                onPress={() => onTagPress(tag)}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  backgroundColor: selectedTags.includes(tag) ? '#ff6961' : 'white',
                }}
              >
                <Text>{tag.nom}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: -100,
            backgroundColor: 'white',
            padding: 15,
            borderTopWidth: 1,
            borderTopColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{ padding: 10, borderRadius: 30, borderWidth: 1, width: '55%', alignItems: 'center', borderColor: 'black', backgroundColor: '#87ceec' }}
            onPress={onAccept}
          >
            <Text style={{ color: 'black' }}>Filtrar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
      backgroundColor: '#ccc',
      borderRadius: 120,
      aspectRatio: 1,
      position: 'absolute',
  },
  closeIcon: {
      top: 50,
      right: 25,
  },
});


export default TagModal;
