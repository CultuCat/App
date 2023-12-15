import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';

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
        <View style={{ marginTop: 70 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', marginLeft: 10 }}>
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
            style={{ padding: 10, borderRadius: 10, borderWidth: 1, width: '35%', alignItems: 'center', borderColor: 'black', backgroundColor: '#87ceec' }}
            onPress={onAccept}
          >
            <Text style={{ color: 'black' }}>Acceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 10, borderRadius: 10,marginLeft: 50, borderWidth: 1, width: '35%', alignItems: 'center', borderColor: 'black', backgroundColor: 'transparent' }}
            onPress={onCloseModal}
          >
            <Text style={{ color: 'black' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TagModal;
