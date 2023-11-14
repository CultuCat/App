import React from 'react';
import { Alert, Share, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const ShareMenu = (props) => {
    const { enllac } = props;
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: enllac
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };
    return (
        <TouchableOpacity onPress={onShare} style={styles.iconContainer}>
            <Ionicons name="share-social-outline" size={24} color="black" style={{ margin: 6 }} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: colors.terciary,
        borderRadius: 100,
        aspectRatio: 1,
    },
});

export default ShareMenu;