import React, { useEffect, useState } from 'react';
import { Image, FlatList, StyleSheet, Modal, View, Text, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';


const User = ({ position, me, imatge, name, username, points }) => {
    const userStyles = [
        styles.user,
        me && styles.myUser,
        position == 1 && styles.user1,
        position == 2 && styles.user2,
        position == 3 && styles.user3,
    ];

    return (
        <View style={userStyles}>
            <Text style={styles.position}>{position}.</Text>
            <Image source={{ uri: imatge }} style={styles.image} />
            <View style={styles.itemText}>
                <Text style={styles.name}>{name}</Text>
                <Text>{username}</Text>
            </View>
            <Text style={styles.name}>{points}</Text>
        </View>
    );
};

const RankingModal = ({
    userId,
    rankingVisible,
    setRankingVisible,
}) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
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
                setUsers(data.filter((item) =>
                    item.isVisible && !item.isBlocked
                ));
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [Platform === 'ios' && users]);

    const closeModal = () => {
        setRankingVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            visible={rankingVisible}
            onRequestClose={closeModal}
        >
            <View style={[styles.modalContainer, Platform.OS === 'android' && { marginTop: '0' }]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1%'
                }}>
                    <Text style={styles.title}>{t('User.Rank')}</Text>
                    <TouchableOpacity style={styles.iconContainer} onPress={closeModal}>
                        <Ionicons name="ios-close-outline" size={36} color="black" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={users}
                    renderItem={({ item, index }) => (
                        <User position={index + 1} me={item.id === userId} imatge={item.imatge} name={item.first_name} username={item.username} points={item.puntuacio} />
                    )}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchData} />
                    }
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 60,
        marginBottom: 20,
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
        marginTop: 10,
        alignSelf: 'flex-start'
    },
});

export default RankingModal;
