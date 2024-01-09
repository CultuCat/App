import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const UserPreview = ({ id, image, name, username }) => {
    const navigation = useNavigation();
    const handlePress = (friendId) => {
        navigation.navigate('profilefriend', { id: friendId });
    };

    return (
        <TouchableOpacity style={styles.user} onPress={() => handlePress(id)}>
            <Image
                source={{ uri: image }}
                style={styles.image}
            />
            <View style={styles.itemText}>
                <Text style={styles.name}>{name}</Text>
                <Text>{username}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    user: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 5,
    },
    image: {
        width: 60,
        height: 60,
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

export default UserPreview;
