import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Chip = (props) => {
    const { text, color } = props;
    const styles = StyleSheet.create({
        chip: {
            backgroundColor: color,
            alignSelf: 'flex-start',
            borderRadius: 100,
        },
        text: {
            marginVertical: 5,
            marginHorizontal: 10,
        }
    });

    return (
        <View style={styles.chip}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

export default Chip;