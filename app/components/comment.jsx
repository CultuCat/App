import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Comment = ({ username, time, text }) => {
  const transformDate = (date) => {
    const dateObj = new Date(date);
    const formatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
    return formatter.format(dateObj);
  };  

  return (
    <View style={styles.comment}>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{username}</Text>
          <Text style={styles.commentTimestamp}>{transformDate(time)}</Text>
        </View>
        <Text style={styles.commentText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    display: 'flex',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentUsername: {
    fontWeight: 'bold',
  },
  commentTimestamp: {
    color: '#777',
  },
  commentText: {
    marginTop: 5,
  },
});

export default Comment;
