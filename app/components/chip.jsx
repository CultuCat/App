import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Chip = (props) => {
    const { text, color,icon } = props;
    const styles = StyleSheet.create({
        chip: {
            backgroundColor: color,
            alignSelf: 'flex-start',
            borderRadius: 100,
            flexDirection: 'row',
            paddingVertical: 5,
            paddingHorizontal:10
        },
        text: {
            marginLeft:5,
        }
    });

    return (
        <View style={styles.chip}>
            {icon &&
            <Ionicons name={icon} size={16} color="black"/>
            }
            <Text style={icon && styles.text}>{text}</Text>
        </View>
    );
};

export default Chip;