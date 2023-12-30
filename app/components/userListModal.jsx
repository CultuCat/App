import React from 'react';
import { FlatList, StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import UserPreview from './userPreview';

const UserListModal = ({
    users,
    usersVisible,
    setUsersVisible,
}) => {
    const closeModal = () => {
        setUsersVisible(false);
    };

    const filteredUsers = users ? users.filter((item) =>
        item.isVisible && !item.isBlocked
    ) : [];

    return (
        <Modal
            animationType="slide"
            visible={usersVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.modalContainer}>
                <View style={{marginHorizontal: '5%'}}>
                    <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={closeModal}>
                        <Ionicons name="ios-close-outline" size={36} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Assistents</Text>
                </View>
                {filteredUsers ? (
                    <FlatList
                        data={filteredUsers}
                        renderItem={({ item }) => (
                            <UserPreview id={item.id} image={item.imatge} name={item.first_name} username={item.username} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            No hi ha assistents per aquest esdeveniment
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 60,
        marginVertical: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 75,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50,
        alignSelf: 'flex-start'
    },
});

export default UserListModal;
