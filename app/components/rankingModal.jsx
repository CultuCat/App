import React, { useEffect, useState } from 'react';
import { Image, FlatList, StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';


const RankingModal = ({
    userId,
    rankingVisible,
    setRankingVisible,
}) => {

    const User = ({ position, id, imatge, name, username, points }) => {
        const userStyles = [
            styles.user,
            userId == id && styles.myUser,
            position == 1 && styles.user1,
            position == 2 && styles.user2,
            position == 3 && styles.user3,
            
        ];

        return (
            <View style={userStyles}>
                <Text style={styles.position}>{position}.</Text>
                <Image source={{ uri: imatge }} style={styles.image} onError={(error) => console.log("Error cargando la imagen:", error)} />
                <View style={styles.itemText}>
                    <Text style={styles.name}>{name}</Text>
                    <Text>{username}</Text>
                </View>
                <Text style={styles.name}>{points}</Text>
            </View>
        );
    };


    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`https://cultucat.hemanuelpc.es/users/?ordering=-puntuacio`, {
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
        setRankingVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            visible={rankingVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={closeModal}>
                    <Ionicons name="ios-close-outline" size={36} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Rànquing</Text>
                <FlatList
                    data={users}
                    renderItem={({ item, index }) => (
                        <User position={index + 1} id={item.id} imatge={item.imatge} name={item.first_name} username={item.username} points={item.puntuacio} />
                    )}
                    keyExtractor={(item) => item.id}
                />
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
    user1: {
        backgroundColor: '#ffd700',
    },
    user2: {
        backgroundColor: '#bebebe',
    },
    user3: {
        backgroundColor: '#cd7f32',
    },
    myUser: {
        backgroundColor: '#ff6961',
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
    position: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: '5%',
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

export default RankingModal;
