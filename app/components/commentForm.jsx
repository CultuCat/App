import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../constants/colors';

const CommentForm = ({ eventId, fetchComments }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        const userTokenString = await AsyncStorage.getItem("@user");
        const userToken = JSON.parse(userTokenString).token;
        const data = {
            event: eventId,
            text: comment
        };
        fetch('https://cultucat.hemanuelpc.es/comments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    setComment('');
                    fetchComments();
                } else {
                    const errorData = response.json();
                    throw new Error('Error en la solicitud: ' + errorData.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu comentario aquí"
                value={comment}
                onChangeText={text => setComment(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
                <Ionicons name="send" size={20} color='white' />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    input: {
        width: '85%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    sendButton: {
        backgroundColor: colors.secondary,
        borderRadius: 50,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
      },
});

export default CommentForm;
