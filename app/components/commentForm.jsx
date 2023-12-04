import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const CommentForm = ({ eventId }) => {
    const [comment, setComment] = useState('');
    const {t} =useTranslation();


    const handleSubmit = () => {
        const data = {
            event: eventId,
            text: comment
        };
        fetch('https://cultucat.hemanuelpc.es/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            } else {
                throw new Error('Error al enviar el comentario');
            }
        })
        .then((responseData) => {
            console.log('Comentario enviado:', responseData);
            setComment(''); 
            fetchComments(); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder={t('Comments.Comment')}
                value={comment}
                onChangeText={text => setComment(text)}
            />
            <Button
                title={t('Comments.Enviar')}
                onPress={handleSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginVertical: 10,
      padding: 10,
      borderRadius: 5,
    },
});

export default CommentForm;
