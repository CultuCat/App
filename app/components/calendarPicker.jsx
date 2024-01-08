import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import CalendarPicker from 'react-native-calendar-picker';

const CustomCalendarPicker = ({
    calendarVisible,
    setCalendarVisible,
    onAccept,
    selectedStartDate,
    selectedEndDate,
    setSelectedStartDate,
    setSelectedEndDate,
  }) => {
    const { t } = useTranslation();
    const closeCalendar = () => {
      setCalendarVisible(false);
    };
  
    const handleAccept = () => {
      onAccept(selectedStartDate, selectedEndDate);
      closeCalendar();
    };
  
    const onDateChange = (date, type) => {
      if (type === 'END_DATE') {
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    };
  
    

  return (
    <Modal animationType="slide" visible={calendarVisible} onBackdropPress={closeCalendar}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={[styles.iconContainer, styles.closeIcon]} onPress={closeCalendar}>
          <Ionicons name="ios-close-outline" size={36} color="black" />
        </TouchableOpacity>
        <View style={{ marginBottom: 20 }}>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={new Date()}
            maxDate={new Date(2030, 6, 3)}
            todayBackgroundColor="#f2e6ff"
            selectedDayColor="#87ceec"
            selectedDayTextColor="#FFFFFF"
            onDateChange={onDateChange}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
          />
        </View>
        <Button title={t('Search.Calendari')} onPress={handleAccept} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 60,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
  },
  closeIcon: {
    top: 10,
    right: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    marginRight: 50,
  },
});

export default CustomCalendarPicker;
