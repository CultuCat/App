import React, { useEffect, useState } from 'react';
import { Image, FlatList, StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const UserListModal = ({
    eventId,
    usersVisible,
    setUsersVisible,
}) => {
    const handleUser = (id) => {
        // TODO: click on user
        return () => {
            console.log("User id:", id);
        };
    };

    const User = ({ id, avatar, name, nickname }) => (
        <TouchableOpacity style={styles.user} onPress={handleUser(id)}>
            <Image source={{ uri: avatar }} style={styles.image} onError={(error) => console.log("Error cargando la imagen:", error)} />
            <View style={styles.itemText}>
                <Text style={styles.name}>{name}</Text>
                <Text>{nickname}</Text>
            </View>
            <Ionicons name="ios-chevron-forward" size={24} color="black" />
        </TouchableOpacity>
    );

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`https://cultucat.hemanuelpc.es/tickets/?event=${eventId}`, {
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
                setUsers(data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);
    const closeModal = () => {
        setUsersVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            visible={usersVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={closeModal}>
                    <Ionicons name="ios-close-outline" size={36} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Assistents</Text>
                {users.length > 0 ? (
                    <FlatList
                        data={users}
                        renderItem={({ item }) => (
                            <User id={item.id} avatar={item.avatar} name={item.name} nickname={item.nickname} />
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
        marginHorizontal: 20,
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
    user: {
        padding: 14,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    image: {
        width: 70,
        height: 70,
        marginRight: 10,
        borderRadius: 100,
    },
    itemText: {
        flex: 1,
    },
    name: {
        fontSize: 20,
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
