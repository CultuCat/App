import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CommentForm = () => {
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        // post comment
        setComment('');
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu comentario aquí"
                value={comment}
                onChangeText={text => setComment(text)}
            />
            <Button
                title="Enviar Comentari"
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
