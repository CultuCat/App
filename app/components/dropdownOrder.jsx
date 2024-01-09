import React, { useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropdownOrder = ({ defaultValue, items, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '3%', zIndex: 100 }}>
      <DropDownPicker
        defaultValue={defaultValue}
        containerStyle={{
          height: 28,
          width: 120,
          marginRight: 10,
        }}
        style={{ backgroundColor: '#ff6961', minHeight: 40, borderRadius: 10, borderColor: '#ff6961'}}
        labelStyle={{
          fontSize: 14,
          textAlign: 'left',
          color: 'black',
        }}
        dropDownStyle={{ backgroundColor: '#fafafa' }}
        onSelectItem={(item) => {
          setValue(item.value);
          onValueChange(item.value);
        }}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        placeholder="Ordenar"
        placeholderStyle={{ color: 'black' }}
      />
    </View>
  );
};

export default DropdownOrder;
