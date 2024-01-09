import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import UserPreview from './userPreview';
import FriendStatusIcon from './friendStatusIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const FriendListModal = ({
    users,
    friendsVisible,
    setFriendsVisible,
}) => {
    const { t } = useTranslation();
    const [localUserId, setLocalUserId] = useState(null);

    useEffect(() => {
        const fetchLocalUser = async () => {
            const userId = await getLocalUser();
            setLocalUserId(userId);
        };

        fetchLocalUser();
    }, []);

    const closeModal = () => {
        setFriendsVisible(false);
    };

    const getLocalUser = async () => {
        try {
            const dataString = await AsyncStorage.getItem("@user");
            if (!dataString) return null;
            const data = JSON.parse(dataString);
            return data.user.id;
        } catch (error) {
            console.error('Error getting local user data:', error);
            return null;
        }
    };

    const filteredUsers = users ? users.filter((item) => {
        return item.isVisible && !item.isBlocked
    }) : [];

    return (
        <Modal
            animationType="slide"
            visible={friendsVisible}
            onRequestClose={closeModal}
        >
            <View style={[styles.modalContainer, Platform.OS === 'android' && { marginTop: '0' }]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1%',
                    marginHorizontal: 20,
                }}>
                    <Text style={styles.title}>{t('User.Amics')}</Text>
                    <TouchableOpacity style={styles.iconContainer} onPress={closeModal}>
                        <Ionicons name="ios-close-outline" size={36} color="black" />
                    </TouchableOpacity>
                </View>
                {filteredUsers ? (
                    <FlatList
                        data={filteredUsers}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 4 }}>
                                    <UserPreview id={item.id} image={item.imatge} name={item.first_name} username={item.username} />
                                </View>
                                {localUserId !== item.id &&
                                    <FriendStatusIcon
                                        style={{ marginRight: 20 }}
                                        id={item.id}
                                    />
                                }
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            No tens amics afegits
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 60,
        marginBottom: 20,
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
        marginTop: 10,
        alignSelf: 'flex-start'
    },
});

export default FriendListModal;
